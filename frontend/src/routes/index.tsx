import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import customLogo from "@/assets/custom-logo.png";
import { TLogo } from "@/components/TLogo";
import {
  CheckCircle2,
  Clock,
  Hash,
  ArrowRight,
  ShieldCheck,
  Lock,
  Radio,
  Sun,
  Moon,
  Zap,
  AlertTriangle,
  Timer,
  Loader2,
  Building2,
  Truck,
  Landmark,
  Rocket,
  Sparkle,
  AlertCircle,
  PiggyBank,
  HeartPulse,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Index,
});

// We keep the theme mapping
const toneMap = {
  mint: "bg-[color:var(--pastel-mint)]/30 text-foreground ring-[color:var(--pastel-mint)]/60",
  yellow: "bg-[color:var(--pastel-yellow)]/40 text-foreground ring-[color:var(--pastel-yellow)]/70",
  pink: "bg-[color:var(--pastel-pink)]/35 text-foreground ring-[color:var(--pastel-pink)]/60",
  lavender: "bg-[color:var(--pastel-lavender)]/35 text-foreground ring-[color:var(--pastel-lavender)]/60",
  sky: "bg-[color:var(--pastel-sky)]/35 text-foreground ring-[color:var(--pastel-sky)]/60",
} as const;

function useTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("trace-theme", next ? "dark" : "light");
    } catch {}
    setIsDark(next);
  };
  return { isDark, toggle };
}

function Index() {
  const { isDark, toggle } = useTheme();
  const [showSync, setShowSync] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // --- NEW: Live Backend State ---
  const [traceData, setTraceData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(43);

  const startSync = async () => {
    if (syncing) return;

    setPendingCount(Math.floor(Math.random() * 70) + 15);
    
    setSyncing(true);
    setIsLoading(true);

    try {
      // Fetch live data from your Express backend
      const response = await fetch('http://localhost:5000/api/simulate-trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      setTraceData(data.trace);
      setAnalysisData(data.analysis);

    } catch (error) {
      console.error("Backend fetch failed:", error);
      // Fallback data just in case the backend is down during the demo
      setTraceData({
        transactionId: "TXN-ERROR-OFFLINE",
        amount: 0,
        status: "Offline",
        totalLatencyMs: 0,
        journey: []
      });
      setAnalysisData({ trustScore: 0 });
    }

    setTimeout(() => setFadeOut(true), 2500);
    setTimeout(() => {
      setShowSync(false);
      setSyncing(false);
      setIsLoading(false);
      setFadeOut(false);
    }, 3100);
  };

  const resetDemo = () => {
    setFadeOut(false);
    setSyncing(false);
    setShowSync(true);
    setTraceData(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Soft ambient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-[color:var(--pastel-yellow)] opacity-40 blur-3xl" />
        <div className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-[color:var(--pastel-pink)] opacity-30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[color:var(--pastel-mint)] opacity-30 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <img 
                src={customLogo} 
                alt="Trace Logo" 
                className="h-14 w-auto transition group-hover:scale-105" 
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  trace<span className="text-[color:var(--primary)]">.</span>
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Follow Your Money
                </span>
              </div>
            </a>
          </div>
          <div className="hidden md:flex">
            <div>
              <p className="font-display text-sm italic text-muted-foreground">follow your money, trust every step.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[color:var(--pastel-mint)]/40 px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-[color:var(--pastel-mint)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--pastel-mint)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--pastel-mint)]" />
              </span>
              All systems happy
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition hover:bg-muted"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Transaction header */}
        <section className="rounded-3xl border border-border bg-card/80 p-7 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                Transaction
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
                {traceData?.transactionId || "Loading..."}
              </p>
            </div>

            <Stat label="Amount" value={`$${traceData?.amount || 0}.00`} tone="yellow" />
            <Stat
              label="Status"
              tone="mint"
              value={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--pastel-mint)]/60 px-3 py-1 text-sm font-semibold text-foreground ring-1 ring-[color:var(--pastel-mint)]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {traceData?.currentStatus || "Complete"}
                </span>
              }
            />
            <Stat
              label="Total Latency"
              tone="pink"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono">{traceData?.totalLatencyMs || 0}ms</span>
                </span>
              }
            />
          </div>
        </section>

        {/* Grid: Timeline + Trust */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Payment Telemetry Map */}
          <section className="lg:col-span-2 rounded-3xl border border-border bg-card/80 p-7 shadow-sm backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">Transfer Status</h2>
                <p className="text-sm text-muted-foreground">See exactly where your payment is right now.</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[color:var(--pastel-sky)]/40 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-[color:var(--pastel-sky)]">
                <Radio className="h-3 w-3" />
                Live log
              </div>
            </div>

            <ol className="relative space-y-5">
              <div
                className="pointer-events-none absolute left-[23px] top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-[color:var(--pastel-mint)] via-[color:var(--pastel-lavender)] to-[color:var(--pastel-pink)] opacity-70"
                aria-hidden
              />
              {/* Map over LIVE backend journey array */}
              {traceData?.journey?.map((hop: any, i: number) => (
                <Hop key={hop.id} hop={hop} index={i} />
              ))}
            </ol>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Signed &amp; verified, every step
              </span>
              <span className="font-mono">
                {traceData?.journey?.length || 0} hops · {traceData?.totalLatencyMs || 0}ms end-to-end
              </span>
            </div>
          </section>

          {/* Journey Health passing live score */}
          <JourneyHealth certaintyScore={analysisData?.trustScore || 92} />
        </div>
      </main>

      <button
        type="button"
        onClick={resetDemo}
        className="fixed bottom-4 right-4 z-40 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition hover:bg-muted hover:text-foreground"
      >
        Reset Demo
      </button>

      {showSync && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-[color:var(--pastel-yellow)] opacity-40 blur-3xl" />
            <div className="absolute top-40 -right-24 h-96 w-96 rounded-full bg-[color:var(--pastel-pink)] opacity-30 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[color:var(--pastel-mint)] opacity-30 blur-3xl" />
          </div>

          <div className="relative z-10 flex max-w-lg flex-col items-center px-6 text-center animate-fade-in">
            <img 
              src={customLogo} 
              alt="Trace logo" 
              className="h-32 w-auto object-contain drop-shadow-md animate-pulse" 
            />
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground">
              trace<span className="text-[color:var(--primary)]">.</span>
            </h1>
            <p className="mt-3 font-display text-lg italic text-muted-foreground">
              Follow Your Money. Trust Every Stop.
            </p>

            <button
              type="button"
              onClick={startSync}
              disabled={syncing}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[color:var(--pastel-mint)] via-[color:var(--pastel-sky)] to-[color:var(--pastel-lavender)] px-8 py-4 text-base font-semibold text-foreground shadow-md ring-1 ring-border transition hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-90 disabled:hover:scale-100"
            >
              {syncing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  Syncing {pendingCount} pending transactions...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  Connect your Accounting Software (e.g., QuickBooks / Xero)
                </span>
              )}
            </button>

            <p className="mt-6 text-xs font-medium text-muted-foreground">
              Build observable trust across autonomous financial systems.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Updated JourneyHealth to accept the live score
function JourneyHealth({ certaintyScore }: { certaintyScore: number }) {
  const [open, setOpen] = useState(false);
  const certainty = certaintyScore;
  const radius = 80;
  const circumference = Math.PI * radius;
  const dash = (certainty / 100) * circumference;

  return (
    <aside className="rounded-3xl border border-[color:var(--pastel-mint)] bg-gradient-to-br from-[color:var(--pastel-mint)]/50 via-[color:var(--pastel-yellow)]/40 to-[color:var(--pastel-pink)]/40 p-6 shadow-sm">
      <div className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-foreground/80">
        <HeartPulse className="h-4 w-4 text-emerald-600" />
        Journey Health
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative">
          <svg viewBox="0 0 200 110" className="h-32 w-52">
            <defs>
              <linearGradient id="gaugeStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--pastel-mint)" />
                <stop offset="50%" stopColor="var(--pastel-sky)" />
                <stop offset="100%" stopColor="var(--pastel-lavender)" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="currentColor"
              className="text-muted/60"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeStroke)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="font-display text-4xl font-semibold leading-none tracking-tight text-foreground">
              {certainty}%
            </span>
            <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-foreground/60">
              Arrival Certainty
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-foreground/80">
          On track · arriving around <span className="font-semibold">3:15 PM</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/40 transition hover:scale-[1.01] hover:shadow-lg"
      >
        <Zap className="h-4 w-4" />
        What if I used a faster rail?
      </button>

      {/* Accordions */}
      <Accordion type="multiple" className="mt-4 space-y-2">
        <AccordionItem
          value="risks"
          className="rounded-2xl border border-[color:var(--pastel-yellow)]/70 bg-card/70 px-4 backdrop-blur"
        >
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            <span className="inline-flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              What could hold this up?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 rounded-xl bg-[color:var(--pastel-yellow)]/30 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">First-time sending to this recipient</p>
                  <p className="mt-0.5 text-xs text-foreground/70">
                    New recipients sometimes need a short verification check.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 rounded-xl bg-[color:var(--pastel-pink)]/30 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">Could nudge your inventory order</p>
                  <p className="mt-0.5 text-xs text-foreground/70">
                    Order is due tomorrow · potential shortfall around <span className="font-semibold">$1,200</span>.
                  </p>
                </div>
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="logic"
          className="rounded-2xl border border-[color:var(--pastel-mint)]/70 bg-card/70 px-4 backdrop-blur"
        >
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            <span className="inline-flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-emerald-600" />
              Our Decision Logic
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="rounded-xl bg-[color:var(--pastel-mint)]/30 p-3">
              <p className="text-sm text-foreground">
                We chose the standard network to save you <span className="font-semibold">$15 in wire fees</span>.
              </p>
              <p className="mt-1.5 text-xs text-foreground/70">
                Same destination, gentler cost · no extra steps for you.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 border-l border-white/40 bg-card/70 p-0 backdrop-blur-2xl sm:max-w-md"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-[color:var(--pastel-lavender)] opacity-40 blur-3xl" />
            <div className="absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-[color:var(--pastel-mint)] opacity-40 blur-3xl" />
          </div>

          <SheetHeader className="px-7 pt-8">
            <SheetTitle className="font-display text-2xl font-semibold tracking-tight">
              Need this to arrive faster?
            </SheetTitle>
            <SheetDescription>Pick a delivery speed that fits your day. We&apos;ll handle the rest.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-7 py-6">
            <button
              type="button"
              className="group w-full rounded-2xl border border-border bg-card/80 p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-muted-foreground/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
                    <Truck className="h-5 w-5 text-foreground/70" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Standard Delivery</p>
                    <p className="text-xs text-muted-foreground">1–2 business days</p>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-border">
                  Free
                </span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Your current route. Reliable and on the house.</p>
            </button>

            <div className="relative rounded-2xl bg-gradient-to-br from-[color:var(--pastel-mint)] via-[color:var(--pastel-sky)] to-[color:var(--pastel-lavender)] p-[1.5px] shadow-sm">
              <span className="absolute -top-2.5 right-5 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow ring-1 ring-white/40">
                <Sparkle className="h-3 w-3" />
                Recommended
              </span>
              <button
                type="button"
                className="group relative w-full rounded-[14px] bg-card/90 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-[color:var(--pastel-mint)]/40 hover:via-[color:var(--pastel-sky)]/30 hover:to-[color:var(--pastel-lavender)]/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--pastel-mint)]/70 to-[color:var(--pastel-lavender)]/70 ring-1 ring-white/60">
                      <span
                        className="absolute inset-0 rounded-xl bg-[color:var(--pastel-lavender)] opacity-50 animate-ping"
                        aria-hidden
                      />
                      <Rocket className="relative h-5 w-5 text-foreground" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Express Digital Route</p>
                      <p className="inline-flex items-center gap-1 text-xs text-foreground/70">
                        <Timer className="h-3 w-3" />
                        Arrives in 5 minutes
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-foreground ring-1 ring-border">
                    +$12.00
                  </span>
                </div>
                <p className="mt-3 text-xs text-foreground/70">
                  Skip the queue. Beats your inventory deadline with room to spare.
                </p>
              </button>
            </div>
          </div>

          <SheetFooter className="border-t border-border/60 bg-card/60 px-7 py-5 backdrop-blur">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/40 transition hover:scale-[1.01] hover:shadow-lg"
            >
              <Zap className="h-4 w-4" />
              Confirm Upgrade
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </aside>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  tone?: "mint" | "yellow" | "pink" | "lavender" | "sky";
}) {
  return (
    <div className={`min-w-[150px] rounded-2xl p-4 ${tone ? toneMap[tone] : "bg-muted/40"} ring-1`}>
      <p className="text-xs font-medium text-foreground/70">{label}</p>
      <div className="mt-2 text-xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

// Updated Hop component to handle live backend data
function Hop({ hop, index }: { hop: any; index: number }) {
  const isComplete = hop.status === "complete";
  const isActive = hop.status === "in_transit";
  const isPending = hop.status === "pending";
  
  // Map the beautiful icons and colors based on the step number
  const Icon = index === 0 ? Building2 : index === 1 ? Truck : Landmark;
  const tone = index === 0 ? "mint" : index === 1 ? "lavender" : "sky";

  return (
    <li className="relative flex gap-4 pl-0">
      <div
        className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-4 ring-background ${
          isComplete ? "bg-[color:var(--pastel-mint)]/70" : isActive ? "bg-[color:var(--pastel-lavender)]/70" : "bg-[color:var(--pastel-sky)]/30"
        }`}
      >
        {isActive && (
          <>
            <span className="absolute inset-0 rounded-full bg-[color:var(--pastel-lavender)] opacity-60 animate-ping" aria-hidden />
            <span className="absolute -inset-1 rounded-full ring-2 ring-[color:var(--pastel-lavender)]/70 animate-pulse" aria-hidden />
          </>
        )}
        {isComplete ? (
          <CheckCircle2 className="relative h-5 w-5 text-emerald-600" />
        ) : isActive ? (
          <Truck className="relative h-5 w-5 text-foreground" />
        ) : (
          <Clock className="relative h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className={`flex-1 rounded-2xl p-5 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${toneMap[tone]} ${isPending ? "opacity-70" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-card/80 ring-1 ring-border">
                <Icon className="h-4 w-4 text-foreground" />
              </span>
              <span className="text-sm font-semibold text-foreground">{hop.component}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                  isComplete ? "bg-[color:var(--pastel-mint)]/70 text-foreground ring-[color:var(--pastel-mint)]" : isActive ? "bg-[color:var(--pastel-lavender)]/70 text-foreground ring-[color:var(--pastel-lavender)]" : "bg-card/80 text-foreground/70 ring-border"
                }`}
              >
                {isComplete ? "delivered" : isActive ? "in transit" : "up next"}
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground/80">{hop.label}</p>
          </div>

          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-foreground">
              {hop.latencyMs > 0 ? `${hop.latencyMs}ms` : "—"}
            </p>
            <p className="mt-1 font-mono text-[10px] text-foreground/60">{hop.timestamp}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-foreground/60">
          <span>step {String(index + 1).padStart(2, "0")}</span>
          <ArrowRight className="h-3 w-3" />
          <span>{isComplete ? "verified" : isActive ? "moving" : "waiting"}</span>
        </div>
      </div>
    </li>
  );
}