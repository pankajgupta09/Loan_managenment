"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, Send, SlidersHorizontal, Upload, DollarSign, Calendar, User, CreditCard, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api, formatInr, getStoredUser } from "@/lib/api";
import type { Application, Loan, Payment } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingSpinner";

type BorrowerState = {
  application: Application | null;
  loan: Loan | null;
  payments: Payment[];
};

export default function ApplyPage() {
  const router = useRouter();
  const [state, setState] = useState<BorrowerState>({ application: null, loan: null, payments: [] });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [amount, setAmount] = useState(100000);
  const [tenureDays, setTenureDays] = useState(180);
  const calculation = useMemo(() => {
    const interest = Number(((amount * 12 * tenureDays) / (365 * 100)).toFixed(2));
    return { interest, total: amount + interest };
  }, [amount, tenureDays]);

  async function load() {
    const user = getStoredUser();
    if (!user) return router.push("/login");
    if (user.role !== "BORROWER") return router.push("/dashboard");
    
    try {
      setLoading(true);
      setState(await api<BorrowerState>("/borrower/me"));
    } catch (error) {
      setMessage("Failed to load borrower data");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setActionLoading("eligibility");
    const form = new FormData(event.currentTarget);

    try {
      await api("/borrower/details", {
        method: "POST",
        body: JSON.stringify({
          fullName: form.get("fullName"),
          pan: form.get("pan"),
          dateOfBirth: form.get("dateOfBirth"),
          monthlySalary: Number(form.get("monthlySalary")),
          employmentMode: form.get("employmentMode")
        })
      });
      setMessage("Eligibility check passed successfully!");
      setMessageType("success");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Eligibility check failed.");
      setMessageType("error");
      await load();
    } finally {
      setActionLoading(null);
    }
  }

  async function uploadSlip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setActionLoading("upload");
    const form = new FormData(event.currentTarget);

    try {
      await api("/borrower/salary-slip", { method: "POST", body: form });
      setMessage("Salary slip uploaded successfully!");
      setMessageType("success");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed.");
      setMessageType("error");
    } finally {
      setActionLoading(null);
    }
  }

  async function applyLoan() {
    setMessage("");
    setActionLoading("apply");
    try {
      await api("/borrower/apply", {
        method: "POST",
        body: JSON.stringify({ amount, tenureDays })
      });
      setMessage("Loan application submitted successfully!");
      setMessageType("success");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Application failed.");
      setMessageType("error");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <LoadingState>Loading your application data...</LoadingState>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <Badge variant="primary" className="mb-4">
              <User className="w-3 h-3 mr-1" />
              Borrower Portal
            </Badge>
            <h1 className="text-display-sm font-bold text-neutral-900 mb-3">
              Complete Your Loan Application
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Follow the steps below to complete your eligibility check, upload documents, and apply for your loan.
            </p>
          </div>

          {/* Status Overview Card */}
          <Card variant="elevated" className="lg:w-80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="text-primary-600" size={20} />
                Application Status
              </CardTitle>
              <CardDescription>Track your application progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <StatusItem 
                  label="Eligibility" 
                  value={state.application?.eligibilityStatus ?? "PENDING"} 
                  icon={state.application?.eligibilityStatus === "PASSED" ? CheckCircle : Clock}
                />
                <StatusItem 
                  label="Documents" 
                  value={state.application?.salarySlip ? "UPLOADED" : "PENDING"} 
                  icon={state.application?.salarySlip ? CheckCircle : Upload} 
                />
                <StatusItem 
                  label="Loan Status" 
                  value={state.loan?.status ?? "NOT APPLIED"} 
                  icon={CreditCard} 
                />
                <StatusItem 
                  label="Amount Paid" 
                  value={formatInr(state.loan?.amountPaid ?? 0)} 
                  icon={DollarSign} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert variant={messageType} dismissible onDismiss={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {/* Main Application Steps */}
        <div className="grid gap-6 xl:grid-cols-3 lg:grid-cols-2">
          {/* Step 1: Personal Details */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                  1
                </div>
                Personal Details
              </CardTitle>
              <CardDescription>Complete your profile information for eligibility check</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={saveDetails}>
                <Input
                  name="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                  defaultValue={state.application?.fullName || ""}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
                <Input
                  name="pan"
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  defaultValue={state.application?.pan || ""}
                  className="uppercase"
                  maxLength={10}
                  required
                />
                <Input
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  leftIcon={<Calendar className="w-4 h-4" />}
                  required
                />
                <Input
                  name="monthlySalary"
                  label="Monthly Salary"
                  type="number"
                  min={0}
                  placeholder="Enter monthly salary"
                  defaultValue={state.application?.monthlySalary || ""}
                  leftIcon={<DollarSign className="w-4 h-4" />}
                  required
                />
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Employment Mode
                  </label>
                  <select 
                    name="employmentMode" 
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus-ring"
                    defaultValue={state.application?.employmentMode ?? "SALARIED"}
                  >
                    <option value="SALARIED">Salaried Employee</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="UNEMPLOYED">Currently Unemployed</option>
                  </select>
                </div>
                
                {state.application?.eligibilityErrors?.length ? (
                  <Alert variant="error">
                    <div className="space-y-1">
                      {state.application.eligibilityErrors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      ))}
                    </div>
                  </Alert>
                ) : null}

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                  loading={actionLoading === "eligibility"}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  {actionLoading === "eligibility" ? "Checking Eligibility..." : "Check Eligibility"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Step 2: Document Upload */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 font-semibold text-sm">
                  2
                </div>
                Document Upload
              </CardTitle>
              <CardDescription>Upload your salary slip for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={uploadSlip}>
                <div>
                  <label className="text-sm font-medium text-neutral-700 mb-2 block">
                    Salary Slip
                  </label>
                  <div className="relative">
                    <input
                      name="salarySlip"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      className="w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg px-4 py-8 text-center cursor-pointer hover:border-primary-400 focus-ring file:hidden"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                      <p className="text-sm text-neutral-600">Drop files or click to upload</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Supported formats: PDF, JPG, PNG (Max: 5MB)
                  </p>
                </div>

                {state.application?.salarySlip && (
                  <Alert variant="success">
                    <CheckCircle className="w-4 h-4" />
                    Salary slip uploaded successfully
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  variant="warning" 
                  size="lg" 
                  className="w-full"
                  loading={actionLoading === "upload"}
                  leftIcon={<FileUp className="w-4 h-4" />}
                >
                  {actionLoading === "upload" ? "Uploading..." : "Upload Document"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Step 3: Loan Configuration */}
          <Card variant="elevated" className="xl:col-span-1 lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center text-success-600 font-semibold text-sm">
                  3
                </div>
                Loan Configuration
              </CardTitle>
              <CardDescription>Configure your loan amount and tenure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Slider 
                  label="Loan Amount" 
                  value={amount} 
                  min={50000} 
                  max={500000} 
                  step={10000} 
                  onChange={setAmount} 
                  display={formatInr(amount)} 
                />
                <Slider 
                  label="Loan Tenure" 
                  value={tenureDays} 
                  min={30} 
                  max={365} 
                  step={5} 
                  onChange={setTenureDays} 
                  display={`${tenureDays} days`} 
                />
                
                {/* Loan Summary */}
                <Card variant="outlined" className="bg-primary-50 border-primary-200">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-primary-700 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-primary-900">{formatInr(calculation.total)}</p>
                      <div className="flex justify-between text-xs text-primary-700 mt-3">
                        <span>Principal: {formatInr(amount)}</span>
                        <span>Interest (12% p.a.): {formatInr(calculation.interest)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={applyLoan} 
                  variant="gradient" 
                  size="lg" 
                  className="w-full"
                  loading={actionLoading === "apply"}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  {actionLoading === "apply" ? "Submitting Application..." : "Apply for Loan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History (if loan exists and has payments) */}
        {state.loan && state.payments.length > 0 && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Track your loan repayments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-center py-2">UTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.payments.map((payment, index) => (
                      <tr key={index} className="border-b border-neutral-100">
                        <td className="py-2">{new Date(payment.paidAt).toLocaleDateString()}</td>
                        <td className="text-right py-2 font-medium">{formatInr(payment.amount)}</td>
                        <td className="text-center py-2 font-mono text-xs">{payment.utr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function StatusItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-neutral-500" />
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      </div>
      <StatusBadge status={value} />
    </div>
  );
}

function Slider(props: { label: string; value: number; min: number; max: number; step: number; display: string; onChange: (value: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">{props.label}</label>
        <Badge variant="outline" className="font-mono">
          {props.display}
        </Badge>
      </div>
      <input
        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((props.value - props.min) / (props.max - props.min)) * 100}%, rgb(229 231 235) ${((props.value - props.min) / (props.max - props.min)) * 100}%, rgb(229 231 235) 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-neutral-500">
        <span>{props.min === 50000 ? '₹50K' : '30 days'}</span>
        <span>{props.max === 500000 ? '₹5L' : '365 days'}</span>
      </div>
    </div>
  );
}
