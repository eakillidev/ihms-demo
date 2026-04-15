import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Home } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
      <div className="w-full max-w-md px-8">
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4">
            <Home className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl tracking-tight text-gray-900">Welcome Back!</h1>
          <p className="mt-2 text-gray-500">Monitor Your Home Energy Usage</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-12 rounded-xl border-gray-200 bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="h-12 rounded-xl border-gray-200 bg-white"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Sign in
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={onSwitchToSignup}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Don't have an account? <span className="text-emerald-600">Sign up</span>
          </button>
        </div>
      </div>
    </div>
  );
}