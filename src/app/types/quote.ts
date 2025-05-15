import { z } from "zod";

const CurrencyAmountSchema = z.object({
  currency: z.string().nullable(),
  amount: z.number().nullable(),
  actual: z.number().nullable(),
});

export const QuoteSummarySchema = z.object({
  metadata: z.record(z.any()).optional(),

  uuid: z.string(),
  merchantDisplayName: z.string(),
  merchantId: z.string(),
  dateCreated: z.number(),
  expiryDate: z.number(),
  quoteExpiryDate: z.number().nullable().optional(),
  acceptanceExpiryDate: z.number().nullable().optional(),

  quoteStatus: z.enum(["TEMPLATE", "ACCEPTED", "PENDING"]),
  reference: z.string(),
  type: z.literal("IN"),
  subType: z.string(),
  status: z.string(),

  displayCurrency: CurrencyAmountSchema,
  walletCurrency: CurrencyAmountSchema,
  paidCurrency: CurrencyAmountSchema,
  feeCurrency: CurrencyAmountSchema,
  networkFeeCurrency: z.any().nullable().optional(),


  displayRate: z.any().optional(),
  exchangeRate: z.any().optional(),

  address: z.any().nullable().optional(),

  returnUrl: z.string().optional(),
  redirectUrl: z.string(),

  transactions: z.array(z.any()).optional(),
  refund: z.any().nullable().optional(),
  refunds: z.array(z.any()).optional(),

  currencyOptions: z.array(z.any()).nullable().optional(), 
  flow: z.string().nullable().optional(),                 
  twoStep: z.boolean().optional(),
  pegged: z.boolean().optional(),

  customerId: z.string().optional(),
  walletId: z.string().optional(),
});

export type QuoteSummary = z.infer<typeof QuoteSummarySchema>;
