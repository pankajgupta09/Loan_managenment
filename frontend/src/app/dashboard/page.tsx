"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Banknote, HandCoins, ListChecks, RefreshCw, SendHorizontal, Users, TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Calendar, User, CreditCard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api, formatInr, getStoredUser } from "@/lib/api";
import type { Application, Loan, Role } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingSpinner";

type ModuleKey = "sales" | "sanction" | "disbursement" | "collection";
type DashboardLoan = Omit<Loan, "borrower" | "application"> & {
  borrower?: { name?: string; email?: string };
  application?: Application;
};
type Lead = {
  borrower: { _id: string; name: string; email: string };
  application: Application | null;
};

const modules: Array<{ key: ModuleKey; label: string; icon: typeof ListChecks; description: string; color: string }> = [
  { key: "sales", label: "Sales", icon: ListChecks, description: "Manage leads and prospects", color: "bg-primary-100 text-primary-700 border-primary-200" },
  { key: "sanction", label: "Sanction", icon: BadgeCheck, description: "Approve loan applications", color: "bg-warning-100 text-warning-700 border-warning-200" },
  { key: "disbursement", label: "Disbursement", icon: Banknote, description: "Process loan disbursements", color: "bg-success-100 text-success-700 border-success-200" },
  { key: "collection", label: "Collection", icon: HandCoins, description: "Track loan repayments", color: "bg-error-100 text-error-700 border-error-200" }
];

const access: Record<Role, ModuleKey[]> = {
  ADMIN: ["sales", "sanction", "disbursement", "collection"],
  SALES: ["sales"],
  SANCTION: ["sanction"],
  DISBURSEMENT: ["disbursement"],
  COLLECTION: ["collection"],
  BORROWER: []
};

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("BORROWER");
  const [active, setActive] = useState<ModuleKey>("sales");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loans, setLoans] = useState<DashboardLoan[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const available = useMemo(() => access[role], [role]);

  async function load(moduleKey = active) {
    const user = getStoredUser();
    if (!user) return router.push("/login");
    if (user.role === "BORROWER") return router.push("/apply");

    try {
      setLoading(true);
      setRole(user.role);
      const firstModule = access[user.role][0];
      const selected = access[user.role].includes(moduleKey) ? moduleKey : firstModule;
      setActive(selected);

      const result = await api<{ leads?: Lead[]; loans?: DashboardLoan[] }>(`/dashboard/${selected}`);
      setLeads(result.leads ?? []);
      setLoans(result.loans ?? []);
    } catch (error) {
      setMessage("Failed to load dashboard data");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function runAction(path: string, body?: object, actionId?: string) {
    setMessage("");
    setActionLoading(actionId || "action");
    try {
      await api(path, {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined
      });
      setMessage("Action completed successfully!");
      setMessageType("success");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Action failed.");
      setMessageType("error");
    } finally {
      setActionLoading(null);
    }
  }

  async function recordPayment(event: FormEvent<HTMLFormElement>, loanId: string) {
    event.preventDefault();
    setMessage("");
    setActionLoading(`payment-${loanId}`);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      await api(`/dashboard/collection/${loanId}/payments`, {
        method: "POST",
        body: JSON.stringify({
          utrNumber: form.get("utrNumber"),
          amount: Number(form.get("amount")),
          paidAt: form.get("paidAt")
        })
      });

      formElement.reset();
      setMessage("Payment recorded successfully!");
      setMessageType("success");
      await load(active);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Payment failed.");
      setMessageType("error");
    } finally {
      setActionLoading(null);
    }
  }
  if (loading) {
    return (
      <AppShell>
        <LoadingState>Loading dashboard data...</LoadingState>
      </AppShell>
    );
  }

  const activeModule = modules.find(m => m.key === active);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <Badge variant="gradient" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              Operations Dashboard
            </Badge>
            <h1 className="text-display-sm font-bold text-neutral-900 mb-3">
              Loan Operations Center
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Manage your loan portfolio with role-based access controls and streamlined workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* KPI Overview */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-neutral-50 rounded-lg border">
              <div className="text-center">
                <div className="text-sm font-medium text-neutral-900">{leads.length + loans.length}</div>
                <div className="text-xs text-neutral-600">Total Items</div>
              </div>
              <div className="w-px h-8 bg-neutral-200"></div>
              <div className="text-center">
                <div className="text-sm font-medium text-neutral-900">{available.length}</div>
                <div className="text-xs text-neutral-600">Modules</div>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => load()}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="flex flex-wrap gap-3">
          {modules
            .filter((item) => available.includes(item.key))
            .map((item) => (
              <Card
                key={item.key}
                variant={active === item.key ? "elevated" : "outlined"}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  active === item.key ? item.color : "hover:border-primary-300"
                }`}
                onClick={() => load(item.key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      active === item.key ? "bg-white/20" : "bg-neutral-100"
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        active === item.key ? "text-current" : "text-neutral-600"
                      }`} />
                    </div>
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs opacity-80">{item.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Message Alert */}
        {message && (
          <Alert variant={messageType} dismissible onDismiss={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {/* Main Content */}
        <div>
          {active === "sales" && <ModernSalesModule leads={leads} />}
          {active === "sanction" && (
            <ModernLoanModule 
              loans={loans} 
              emptyMessage="No loan applications pending sanction approval" 
              actions={(loan) => (
                <ModernSanctionActions 
                  loan={loan} 
                  runAction={runAction} 
                  actionLoading={actionLoading}
                />
              )} 
            />
          )}
          {active === "disbursement" && (
            <ModernLoanModule 
              loans={loans} 
              emptyMessage="No sanctioned loans ready for disbursement" 
              actions={(loan) => (
                <Button 
                  variant="success" 
                  size="sm"
                  loading={actionLoading === `disburse-${loan._id}`}
                  onClick={() => runAction(`/dashboard/disbursement/${loan._id}/disburse`, undefined, `disburse-${loan._id}`)}
                  leftIcon={<Banknote className="w-4 h-4" />}
                >
                  Disburse Loan
                </Button>
              )} 
            />
          )}
          {active === "collection" && (
            <ModernLoanModule 
              loans={loans} 
              emptyMessage="No active loans requiring collection" 
              actions={(loan) => (
                <ModernPaymentForm 
                  loan={loan} 
                  recordPayment={recordPayment}
                  actionLoading={actionLoading}
                />
              )} 
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ModernSalesModule({ leads }: { leads: Lead[] }) {
  if (!leads.length) {
    return (
      <Card className="p-12 text-center">
        <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Active Leads</h3>
        <p className="text-neutral-600">No borrower leads requiring attention at this time.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {leads.map((lead) => (
        <Card key={lead.borrower._id} variant="elevated" className="card-hover">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{lead.borrower.name}</CardTitle>
                  <CardDescription>{lead.borrower.email}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Eligibility Status</span>
                <StatusBadge status={lead.application?.eligibilityStatus ?? "PENDING"} />
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">Monthly Salary</span>
                <Badge variant="outline" className="font-mono">
                  {lead.application ? formatInr(lead.application.monthlySalary) : "Pending"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ModernLoanModule({ loans, emptyMessage, actions }: { loans: DashboardLoan[]; emptyMessage: string; actions: (loan: DashboardLoan) => React.ReactNode }) {
  if (!loans.length) {
    return (
      <Card className="p-12 text-center">
        <CreditCard className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Loans Found</h3>
        <p className="text-neutral-600">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {loans.map((loan) => {
        const outstanding = loan.totalRepayment - loan.amountPaid;
        const completedPercentage = (loan.amountPaid / loan.totalRepayment) * 100;
        
        return (
          <Card key={loan._id} variant="elevated" className="card-hover">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>{loan.borrower?.name ?? "Borrower"}</CardTitle>
                    <CardDescription>{loan.borrower?.email}</CardDescription>
                  </div>
                </div>
                <StatusBadge status={loan.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Loan Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <ModernMetric label="Principal" value={formatInr(loan.amount)} icon={DollarSign} />
                  <ModernMetric label="Interest" value={formatInr(loan.interestAmount)} icon={TrendingUp} />
                  <ModernMetric label="Total Due" value={formatInr(loan.totalRepayment)} icon={CreditCard} />
                  <ModernMetric label="Outstanding" value={formatInr(outstanding)} icon={Clock} />
                </div>

                {/* Progress Bar */}
                {loan.amountPaid > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Repayment Progress</span>
                      <span className="font-medium">{completedPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(completedPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-neutral-200">
                  {actions(loan)}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ModernSanctionActions({ loan, runAction, actionLoading }: { 
  loan: DashboardLoan; 
  runAction: (path: string, body?: object, actionId?: string) => Promise<void>;
  actionLoading: string | null;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        variant="success" 
        size="sm"
        loading={actionLoading === `approve-${loan._id}`}
        onClick={() => runAction(`/dashboard/sanction/${loan._id}/approve`, undefined, `approve-${loan._id}`)}
        leftIcon={<CheckCircle className="w-4 h-4" />}
      >
        Approve Loan
      </Button>
      <Button
        variant="destructive"
        size="sm"
        loading={actionLoading === `reject-${loan._id}`}
        onClick={() => {
          const reason = window.prompt("Please provide a reason for rejection:");
          if (reason) {
            void runAction(`/dashboard/sanction/${loan._id}/reject`, { reason }, `reject-${loan._id}`);
          }
        }}
        leftIcon={<XCircle className="w-4 h-4" />}
      >
        Reject Loan
      </Button>
    </div>
  );
}

function ModernPaymentForm({ loan, recordPayment, actionLoading }: { 
  loan: DashboardLoan; 
  recordPayment: (event: FormEvent<HTMLFormElement>, loanId: string) => Promise<void>;
  actionLoading: string | null;
}) {
  if (loan.status === "CLOSED") {
    return (
      <Alert variant="success">
        <CheckCircle className="w-4 h-4" />
        Loan has been fully repaid and closed.
      </Alert>
    );
  }

  const maxAmount = loan.totalRepayment - loan.amountPaid;

  return (
    <form 
      className="grid gap-4 lg:grid-cols-[1fr_120px_140px_auto] sm:grid-cols-2" 
      onSubmit={(event) => recordPayment(event, loan._id)}
    >
      <Input
        name="utrNumber"
        placeholder="UTR Reference Number"
        required
        inputSize="sm"
      />
      <Input
        name="amount"
        type="number"
        min={1}
        max={maxAmount}
        placeholder="Amount"
        helperText={`Max: ${formatInr(maxAmount)}`}
        required
        inputSize="sm"
      />
      <Input
        name="paidAt"
        type="date"
        defaultValue={new Date().toISOString().split('T')[0]}
        required
        inputSize="sm"
      />
      <Button 
        type="submit"
        variant="primary"
        size="sm"
        loading={actionLoading === `payment-${loan._id}`}
        leftIcon={<SendHorizontal className="w-4 h-4" />}
        className="lg:w-auto sm:col-span-2 lg:col-span-1"
      >
        Record Payment
      </Button>
    </form>
  );
}

function ModernMetric({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="p-3 bg-neutral-50 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 text-neutral-500" />
        <dt className="text-xs font-medium text-neutral-600 uppercase tracking-wide">{label}</dt>
      </div>
      <dd className="text-sm font-bold text-neutral-900">{value}</dd>
    </div>
  );
}
