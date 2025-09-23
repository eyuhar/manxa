export type RegisterResponse = {
  success: boolean;
  message: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ProfileResponse = {
  id: number;
  email: string;
  user_name: string;
  created_at: string;
};

export async function register(
  email: string,
  password: string,
  username: string
): Promise<RegisterResponse> {
  try {
    const res = await fetch("https://manxa-backend.abrdns.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, user_name: username }),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    return res.json();
  } catch (error) {
    console.error("register Error", error);
    throw error;
  }
}

// sends credentials and returns token from backend
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const res = await fetch("https://manxa-backend.abrdns.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return res.json();
  } catch (error) {
    console.error("login Error", error);
    throw error;
  }
}

export async function fetchProfile(token: string): Promise<ProfileResponse> {
  try {
    const res = await fetch("https://manxa-backend.abrdns.com/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      //invalid token
      throw new Error("Unauthorized: Invalid token");
    }

    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }

    const json: ApiResponse<ProfileResponse> = await res.json();

    return json.data;
  } catch (error) {
    console.error("fetchProfile Error", error);
    throw error;
  }
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
