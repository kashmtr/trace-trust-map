// src/types/traceEngine.ts

export type TransactionStatus = "complete" | "in-progress" | "pending" | "delayed" | "in_transit";

export type ComponentLayer = string;

export interface JourneyStep {
  id: string;
  component: ComponentLayer;
  label: string;
  status: TransactionStatus;
  latencyMs: number;
  timestamp: string;
}

export interface PaymentTrace {
  transactionId: string;
  amount: number;
  currency: string;
  senderId: string;
  recipientId: string;
  isCrossBorder: boolean;
  totalLatencyMs: number;
  currentStatus: TransactionStatus;
  journey: JourneyStep[];
}