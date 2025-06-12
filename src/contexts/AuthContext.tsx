import {
  createContext,
  useContext,
  useEffect,
  useState,
  type JSX,
  type ReactNode,
} from "react"
import { useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query"
import { fetchProfile, getToken, removeToken, saveToken } from "@/services/auth"

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
  login: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  logout: () => { },
  login: () => { },
})

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [token, setToken] = useState<string | null>(getToken())
  const queryClient = useQueryClient()

  const { data: user, isLoading, error }: UseQueryResult<User | null, Error> = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(token!),
    enabled: !!token,
    retry: false, // do not retry on failure
  })

  const login = (newToken: string | null): void => {
    saveToken(newToken!)
    setToken(newToken)
    queryClient.invalidateQueries({ queryKey: ["profile"] })
  }
  
  const logout = (): void => {
    removeToken()
    setToken(null)
    queryClient.removeQueries({ queryKey: ["profile"] })
    window.location.reload() // reloads app state
  }

  useEffect(() => {
    if (error?.message === "Unauthorized: Invalid token") {
      logout() // automatically logout if token is invalid
    }
  }, [error])

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, logout, login}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext)
}
