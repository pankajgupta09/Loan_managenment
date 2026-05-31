import { ArrowRight, BadgeIndianRupee, ClipboardCheck, LockKeyhole, TrendingUp, Users, Shield, Zap, DollarSign, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  const stats = [
    { label: "Loans Processed", value: "₹10M+", icon: DollarSign },
    { label: "Active Users", value: "5,000+", icon: Users },
    { label: "Processing Time", value: "< 2 min", icon: Clock },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
  ];

  const features = [
    { 
      icon: ClipboardCheck, 
      title: "Smart BRE Engine", 
      description: "Advanced Business Rule Engine validates eligibility with age, PAN, salary, and employment verification in real-time.",
      gradient: "from-primary-500 to-primary-600"
    },
    { 
      icon: BadgeIndianRupee, 
      title: "Complete Lifecycle", 
      description: "Full loan journey from application to closure with automated status tracking and role-based workflow management.",
      gradient: "from-success-500 to-success-600"
    },
    { 
      icon: LockKeyhole, 
      title: "Enterprise Security", 
      description: "Bank-grade security with RBAC, JWT authentication, and protected APIs ensuring data privacy at every step.",
      gradient: "from-warning-500 to-warning-600"
    }
  ];

  return (
    <>
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BadgeIndianRupee className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-neutral-900">LoanHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Staff Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" size="sm">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-neutral-50 to-success-50"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-bounce-gentle"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success-200/20 rounded-full blur-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="gradient" className="mb-6 animate-slide-down">
                <Zap className="w-3 h-3 mr-1" />
                Next-Generation Loan Management
              </Badge>
              
              <h1 className="text-display-lg sm:text-display-xl font-bold text-neutral-900 mb-6 animate-slide-up">
                Modern Lending Made
                <span className="text-gradient block">Simple & Secure</span>
              </h1>
              
              <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                Streamline your entire loan lifecycle with our comprehensive platform. 
                From application to disbursement, manage it all with enterprise-grade security and intelligent automation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <Link href="/register">
                  <Button variant="gradient" size="xl" className="animate-pulse-glow">
                    Start Your Application
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="xl">
                    <Shield className="w-5 h-5 mr-2" />
                    Staff Dashboard
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{animationDelay: '0.6s'}}>
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-3">
                      <stat.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                    <div className="text-sm text-neutral-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="primary" className="mb-4">
                Platform Features
              </Badge>
              <h2 className="text-display-md font-bold text-neutral-900 mb-4">
                Everything you need for modern lending
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Built with the latest technologies and security standards to handle enterprise-level loan operations
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={feature.title} variant="elevated" className="group card-hover" interactive>
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-display-md font-bold mb-4">
              Ready to transform your lending process?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of financial institutions already using our platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="secondary" size="xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-primary-900">
                  Staff Access
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
