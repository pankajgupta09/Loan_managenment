"use client";

import { LogOut, BadgeIndianRupee, User, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearSession, getStoredUser } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { RoleBadge } from "@/components/ui/Badge";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = getStoredUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-50 to-primary-50/30">
      <header className="sticky top-0 z-40 glass-morphism border-b border-white/20 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 font-bold text-neutral-900 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <BadgeIndianRupee className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl">LoanHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 mr-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-neutral-900">{user.name || 'User'}</div>
                    <div className="text-xs text-neutral-600">{user.email}</div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                <RoleBadge role={user.role} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    clearSession();
                    router.push("/login");
                  }}
                  className="hover:bg-error-50 hover:text-error-600"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="gradient" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/95 backdrop-blur">
            <div className="px-4 py-4 space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{user.name || 'User'}</div>
                      <div className="text-sm text-neutral-600">{user.email}</div>
                      <RoleBadge role={user.role} className="mt-1" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-error-600 border-error-200 hover:bg-error-50"
                    onClick={() => {
                      clearSession();
                      router.push("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </div>
    </main>
  );
}
