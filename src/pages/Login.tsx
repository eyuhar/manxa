import { useState, type JSX } from "react";
import { login as authLogin, type LoginResponse } from "../services/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function Login(): JSX.Element {
  // local state for input fields
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/"; // redirect after login

  // useMutation handles the login call
  const mutation = useMutation({
    mutationFn: (): Promise<LoginResponse> => authLogin(email, password),
    onSuccess: (data: LoginResponse) => {
      // save token and redirect on success
      login(data.token);
      toast.success("Login successful.");
      navigate(from, { replace: true });
    },
  });

  // form submit handler
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    mutation.mutate(); // triggers login
  };

  return (
    <div className="flex items-center justify-center w-full mt-[10%] p-2">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to log in to your account
            {mutation.isError && (
              <p className="text-red-500 mt-2">Login failed. Try again.</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full"
                >
                  {mutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
