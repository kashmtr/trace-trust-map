// src/server.ts
import express from 'express';
import cors from 'cors';
import type { PaymentTrace } from './types/traceEngine.js';
import { analyzeTrustScore } from './aiAgent.js';

const app = express();
const PORT = 5000;

// Enable CORS so Lovable's cloud UI can talk to our local server
app.use(cors());
app.use(express.json());

// Helper function to generate random latency
const getLatency = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

// The API Endpoint Lovable will call
app.post('/api/simulate-trace', async (req, res) => {
    console.log(`\n[SERVER] Incoming trace request received...`);
    
    // 1. Define our dynamic scenarios
    const scenarios = [
        {
            type: "Payroll",
            baseAmount: 3250,
            hop1: { comp: "Corporate Payroll Account", label: "Payroll batch approved" },
            hop2: { comp: "ACH Clearing House", label: "Routing to employee bank" },
            hop3: { comp: "Employee Bank Account", label: "Awaiting final posting" }
        },
        {
            type: "Inventory Order",
            baseAmount: 14200,
            hop1: { comp: "Business Checking (Chase)", label: "Funds verified for B2B payment" },
            hop2: { comp: "FedWire Network", label: "High-value transit active" },
            hop3: { comp: "Supplier Merchant Account", label: "Confirming incoming wire" }
        },
        {
            type: "Rent Payment",
            baseAmount: 2150,
            hop1: { comp: "Personal Savings (TD Bank)", label: "Rent auto-withdrawal" },
            hop2: { comp: "Interac / EFT Rail", label: "Processing transfer" },
            hop3: { comp: "Property Management Bank", label: "Awaiting auto-deposit" }
        },
        {
            type: "Customer Refund",
            baseAmount: 85,
            hop1: { comp: "Merchant Stripe Balance", label: "Refund initiated" },
            hop2: { comp: "Card Gateway (Visa/MC)", label: "Routing back to issuer" },
            hop3: { comp: "Customer Credit Card", label: "Pending statement credit" }
        }
    ];

    // Pick a random scenario
    if (scenarios.length === 0) {
        return res.status(500).json({ error: "No scenarios available." });
    }
    const activeScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    if (!activeScenario) {
        return res.status(500).json({ error: "Failed to select a scenario." });
    }

    const finalAmount = activeScenario.baseAmount + Math.floor(Math.random() * 50);

    const trace: PaymentTrace = {
        transactionId: `TXN-${Math.floor(Math.random() * 10000)}-${activeScenario.type.substring(0,3).toUpperCase()}`,
        amount: finalAmount,
        currency: "USD",
        senderId: "user_8829A",
        recipientId: "merchant_109B",
        isCrossBorder: false,
        totalLatencyMs: 0,
        currentStatus: "in_transit",
        journey: []
    };

    // Hop 1: Source
    const step1Latency = getLatency(80, 120);
    trace.journey.push({
        id: `step_1_${Date.now()}`,
        component: activeScenario.hop1.comp,
        label: activeScenario.hop1.label,
        status: "complete",
        latencyMs: step1Latency,
        timestamp: new Date().toLocaleTimeString()
    });
    trace.totalLatencyMs += step1Latency;

    // Hop 2: Transit
    const step2Latency = getLatency(350, 450);
    trace.journey.push({
        id: `step_2_${Date.now()}`,
        component: activeScenario.hop2.comp,
        label: activeScenario.hop2.label,
        status: "in_transit",
        latencyMs: step2Latency,
        timestamp: new Date().toLocaleTimeString()
    });
    trace.totalLatencyMs += step2Latency;

    // Hop 3: Final Destination
    trace.journey.push({
        id: `step_3_${Date.now()}`,
        component: activeScenario.hop3.comp,
        label: activeScenario.hop3.label,
        status: "pending",
        latencyMs: 0,
        timestamp: "ETA " + new Date(Date.now() + 5000).toLocaleTimeString()
    });

    // Run the AI Analysis
    const analysis = await analyzeTrustScore(trace);

    // Send to Frontend
    res.json({ trace, analysis });
});

app.listen(PORT, () => {
    console.log(` TRACE Backend Server running live on http://localhost:${PORT}`);
});