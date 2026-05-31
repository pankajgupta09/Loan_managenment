"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, BadgeIndianRupee, ArrowLeft } from "lucide-react";
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

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const result = await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password")
        })
      });
      saveSession(result.token, result.user);
      router.push("/apply");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
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
            <CardTitle className="text-display-xs">Create Account</CardTitle>
            <CardDescription>
              Start your loan application journey with LoanHub
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <Input
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                required
              />
              
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
                type="password"
                placeholder="Create a strong password"
                helperText="Minimum 8 characters required"
                minLength={8}
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
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Next Steps Info */}
            <div className="mt-6 p-4 bg-success-50 rounded-lg border border-success-200">
              <h4 className="text-sm font-medium text-success-900 mb-2">What's Next?</h4>
              <ol className="text-xs text-success-700 space-y-1 list-decimal list-inside">
                <li>Complete your profile details</li>
                <li>Upload salary slip for verification</li>
                <li>Check loan eligibility</li>
                <li>Apply for your loan</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
