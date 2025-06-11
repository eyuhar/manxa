import {
    createContext,
    useContext,
    type ReactNode,
  } from "react"
  import { useQuery } from "@tanstack/react-query"
  import { fetchProfile, getToken, removeToken } from "@/services/auth"
  
  type User = {
    id: number
    email: string
    user_name: string
    created_at: string
}
  
  type AuthContextType = {
    user: User | null
    isLoading: boolean
    logout: () => void
  }
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false,
    logout: () => {},
  })
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const token = getToken()
  
    const { data: user, isLoading } = useQuery({
      queryKey: ["profile"],
      queryFn: () => fetchProfile(token!),
      enabled: !!token,
    })
  
    const logout = () => {
      removeToken()
      window.location.reload() // reloads app state
    }

    return (
      <AuthContext.Provider value={{ user: user ?? null, isLoading, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }
  
  export function useAuth() {
    return useContext(AuthContext)
  }
  