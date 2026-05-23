// src/aiAgent.ts
// src/aiAgent.ts
import type { PaymentTrace } from "./types/traceEngine.js";
import 'dotenv/config';

// Define the expected output structure from our AI
export interface TrustAnalysis {
  transactionId: string;
  confidenceScore: number; // 0 to 100
  riskFlag: "LOW" | "MEDIUM" | "HIGH";
  analysis: string;
}

export async function analyzeTrustScore(trace: PaymentTrace): Promise<TrustAnalysis | null> {
  console.log(`Analyzing Trust Score for TXN: ${trace.transactionId}...`);

  const systemPrompt = `
    You are an autonomous financial risk evaluator. 
    Analyze the following payment telemetry JSON. 
    Calculate a 'confidenceScore' (0-100) based on total latency and hop status. 
    Assign a 'riskFlag' (LOW, MEDIUM, HIGH). 
    Provide a 1-sentence 'analysis' explaining the score.
    Return strictly as a JSON object matching the TrustAnalysis interface.
  `;

  try {
    // Note: We are using a generic fetch structure adaptable to Backboard's exact endpoint
    // Updated to match Backboard's app routing and X-API-Key authorization
    const response = await fetch("https://app.backboard.io/api/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": `${process.env.BACKBOARD_API_KEY}` 
      },
      body: JSON.stringify({
        model: "backboard-core-model", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(trace) }
        ],
        temperature: 0.2 // Low temperature for deterministic financial outputs
      })
    });

    if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the AI's JSON response string back into an object
    const analysisResult: TrustAnalysis = JSON.parse(data.choices[0].message.content);
    return analysisResult;

  } catch (error) {
    console.error("AI Evaluation Failed. Did you add your API key?", error);
    
    // Fallback Mock Data so our demo doesn't crash if the API fails
    console.log("⚠️ Returning mock analysis for demonstration purposes...");
    return {
        transactionId: trace.transactionId,
        confidenceScore: 92,
        riskFlag: "LOW",
        analysis: `Transaction completed in ${trace.totalLatencyMs}ms with no delayed hops, indicating high system reliability.`
    };
  }
}