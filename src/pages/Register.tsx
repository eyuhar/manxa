import type { RegisterResponse } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/services/auth';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


function Register(): JSX.Element {
  //local state for input fields
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  // useMutation handles the registration call
  const mutation = useMutation({
    mutationFn: (): Promise<RegisterResponse> => register(email, password, username),
    onSuccess: (data: RegisterResponse) => {
      if (!data.success) {
        setMessage(data.message || "Registration failed");
        console.error("Registration error:", data.message);
      }else if (data.success) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      }
    },
    onError: (error: Error) => {
      setMessage(error.message || "Registration failed");
      console.error("Registration error:", error);
    },
  });
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setMessage(""); // reset message on new submission
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    mutation.mutate(); // triggers registration
  };

  return (
    <div className="flex items-center justify-center w-full mt-[10%]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register a new account</CardTitle>
          <CardDescription>
            Enter a username, your email and password below to register a new account
            {message && (
              <p className="text-red-500 mt-2">{message}. Try again.</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete='username'
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete='email'
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={mutation.isPending} className="w-full">
                  {mutation.isPending ? "Registering..." : "Register"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
