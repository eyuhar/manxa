export type LoginResponse = {
  token: string;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
}

export type ProfileResponse = {
  id: number;
  email: string;
  user_name: string;
  created_at: string;
}

// sends credentials and returns token from backend
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch("http://52.59.130.106/api/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json(); // expects { token: string }
}

export async function fetchProfile(token: string): Promise<ProfileResponse>{
  const res = await fetch("http://52.59.130.106/api/getProfile.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  
  const json: ApiResponse<ProfileResponse> = await res.json();

  return json.data;
}

export function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function removeToken(): void {
  localStorage.removeItem("token");
}
