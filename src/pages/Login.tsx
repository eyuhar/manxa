import { useState } from "react";
import { login, saveToken } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

function Login() {
  // local state for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // useMutation handles the login call
  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      // save token and redirect on success
      saveToken(data.token);
      navigate("/");
    },
    onError: () => {
      alert("Login failed. Please check your credentials.");
    },
  });

  // form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(); // triggers login
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🔐 Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* optional error display */}
      {mutation.isError && (
        <p className="text-red-500 mt-2">Login failed. Try again.</p>
      )}
    </div>
  );
}

export default Login;
