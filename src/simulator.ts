// src/simulator.ts
// src/simulator.ts
import type { PaymentTrace, TransactionStatus, ComponentLayer } from "./types/traceEngine.js";
import { analyzeTrustScore } from "./aiAgent.js";

// helper function to generate random latency
const getLatency = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

function simulatePaymentProcessing(transactionId: string, amount: number): PaymentTrace {
  console.log(`Initiating Autonomous Transfer: ${transactionId} for $${amount}`);

  const trace: PaymentTrace = {
    transactionId,
    amount,
    currency: "USD",
    senderId: "user_8829A",
    recipientId: "merchant_109B",
    isCrossBorder: false,
    totalLatencyMs: 0,
    currentStatus: "in-progress",
    journey: []
  };

  // simulate 1: Source Account Verification
  const step1Latency = getLatency(50, 150);
  trace.journey.push({
    id: `step_1_${Date.now()}`,
    component: "SourceAccount",
    label: "Funds Verified & Locked",
    status: "complete",
    latencyMs: step1Latency,
    timestamp: new Date().toISOString()
  });
  trace.totalLatencyMs += step1Latency;

  // simulate 2: Payment Rail Routing
  const step2Latency = getLatency(200, 500);
  trace.journey.push({
    id: `step_2_${Date.now()}`,
    component: "PaymentRail",
    label: "Routing via ACH Network",
    status: "complete",
    latencyMs: step2Latency,
    timestamp: new Date().toISOString()
  });
  trace.totalLatencyMs += step2Latency;
  
  trace.currentStatus = "complete";
  console.log("Transfer Complete. Telemetry Logged.");
  
  return trace;
}

// Execute the simulation and run the AI analysis
async function runDemo() {
  const demoTrace = simulatePaymentProcessing("TXN-7739-ALPHA", 1500.00);
  
  const analysis = await analyzeTrustScore(demoTrace);
  
  console.log("\n --- FINAL TRUST REPORT --- ");
  console.log(JSON.stringify(analysis, null, 2));
}

runDemo();