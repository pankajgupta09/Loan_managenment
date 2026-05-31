"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, BadgeIndianRupee, ArrowLeft } from "lucide-react";
import { api, saveSession } from "@/lib/api";
import type { AuthUser } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const result = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password")
        })
      });
      saveSession(result.token, result.user);
      router.push(result.user.role === "BORROWER" ? "/apply" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-success-50/30 flex items-center justify-center px-4 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
      
      <div className="relative w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <Card variant="elevated" className="glass-morphism">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <BadgeIndianRupee className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-display-xs">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
              
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-neutral-600 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              {error && (
                <Alert variant="error" className="animate-slide-down">
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                loading={loading}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                New to LoanHub?{" "}
                <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Create account
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h4 className="text-sm font-medium text-primary-900 mb-2">Demo Credentials</h4>
              <div className="text-xs text-primary-700 space-y-1">
                <p><strong>Staff:</strong> sales@lms.dev</p>
                <p><strong>Borrower:</strong> borrower@lms.dev</p>
                <p><strong>Password:</strong> Password@123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
