import { createHmac, timingSafeEqual } from "node:crypto";
import axios from "axios";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";
import { toKobo } from "../utils/money";

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  timeout: 20_000,
  headers: {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY ?? ""}`,
    "Content-Type": "application/json",
  },
});

interface PaystackEnvelope<T> {
  status: boolean;
  message: string;
  data: T;
}

function assertConfigured() {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new ApiError(
      503,
      "Paystack is not configured. Add PAYSTACK_SECRET_KEY to server/.env.",
    );
  }
}

function handlePaystackError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string } | undefined;
    throw new ApiError(
      502,
      `Paystack: ${payload?.message ?? error.message}`,
    );
  }
  throw error;
}

export interface InitializeTransactionInput {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  subaccount?: string;
  metadata?: Record<string, unknown>;
  /** `subaccount` makes the hotel carry the Paystack fee. */
  bearer?: "account" | "subaccount";
}

export interface InitializedTransaction {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export async function initializeTransaction(
  input: InitializeTransactionInput,
): Promise<InitializedTransaction> {
  assertConfigured();

  try {
    const { data } = await paystack.post<
      PaystackEnvelope<InitializedTransaction>
    >("/transaction/initialize", {
      email: input.email,
      amount: toKobo(input.amount),
      reference: input.reference,
      callback_url: input.callbackUrl,
      bearer: input.bearer ?? "subaccount",
      metadata: input.metadata,
      ...(input.subaccount ? { subaccount: input.subaccount } : {}),
    });

    if (!data.status) {
      throw new ApiError(502, data.message);
    }

    return data.data;
  } catch (error) {
    handlePaystackError(error);
  }
}

export interface VerifiedTransaction {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string;
  customer?: { email?: string };
  subaccount?: Record<string, unknown>;
}

export async function verifyTransaction(
  reference: string,
): Promise<VerifiedTransaction> {
  assertConfigured();

  try {
    const { data } = await paystack.get<
      PaystackEnvelope<VerifiedTransaction>
    >(`/transaction/verify/${encodeURIComponent(reference)}`);

    if (!data.status) {
      throw new ApiError(502, data.message);
    }

    return data.data;
  } catch (error) {
    handlePaystackError(error);
  }
}

export interface CreateSubaccountInput {
  businessName: string;
  settlementBank: string;
  accountNumber: string;
  percentageCharge?: number;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
}

export async function createSubaccount(input: CreateSubaccountInput) {
  assertConfigured();

  try {
    const { data } = await paystack.post<
      PaystackEnvelope<{ subaccount_code: string; id: number }>
    >("/subaccount", {
      business_name: input.businessName,
      settlement_bank: input.settlementBank,
      account_number: input.accountNumber,
      percentage_charge: input.percentageCharge ?? 0,
      primary_contact_email: input.primaryContactEmail,
      primary_contact_phone: input.primaryContactPhone,
    });

    if (!data.status) {
      throw new ApiError(502, data.message);
    }

    return data.data;
  } catch (error) {
    handlePaystackError(error);
  }
}

export async function createRefund(input: {
  transactionReference: string;
  amount?: number;
  reason?: string;
}) {
  assertConfigured();

  try {
    const { data } = await paystack.post<
      PaystackEnvelope<{ id: number; status: string }>
    >("/refund", {
      transaction: input.transactionReference,
      ...(input.amount !== undefined ? { amount: toKobo(input.amount) } : {}),
      ...(input.reason ? { merchant_note: input.reason } : {}),
    });

    if (!data.status) {
      throw new ApiError(502, data.message);
    }

    return data.data;
  } catch (error) {
    handlePaystackError(error);
  }
}

/**
 * Paystack signs webhooks with HMAC-SHA512 using the secret key.
 * Always compare the raw body, never the parsed JSON.
 */
export function verifyWebhookSignature(
  rawBody: Buffer,
  signature: string,
): boolean {
  if (!env.PAYSTACK_SECRET_KEY) return false;

  const expected = createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(signature, "utf8");

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}
