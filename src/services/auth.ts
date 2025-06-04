// sends credentials and returns token from backend
export async function login(email: string, password: string) {
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
  
  export function saveToken(token: string) {
    localStorage.setItem("token", token);
  }
  
  export function getToken() {
    return localStorage.getItem("token");
  }
  
  export function logout() {
    localStorage.removeItem("token");
  }
  