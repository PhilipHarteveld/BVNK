
import { QuoteSummarySchema } from '@/app/types/quote';
import { apiClient } from '@/lib/axios';



export const getQuoteSummary = async (uuid: string) => {
  const { data } = await apiClient.get(`/pay/${uuid}/summary`);

  try {
    return QuoteSummarySchema.parse(data);
  } catch (err) {
    console.error("❌ Zod validation failed in getQuoteSummary:", err);
    throw err;
  }
};

export const updateQuoteSummary = async (uuid: string, currency: string) => {
  const { data } = await apiClient.put(`/pay/${uuid}/update/summary`, {
    currency,
    payInMethod: "crypto",
  });
  return QuoteSummarySchema.parse(data);
};


export const acceptQuote = async (uuid: string) => {
  const { data } = await apiClient.put(`/pay/${uuid}/accept/summary`, {
    successUrl: "no_url",
  });
  return QuoteSummarySchema.parse(data);
};
