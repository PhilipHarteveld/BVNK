import { QuoteSummary, QuoteSummarySchema } from '@/types/quote';
import { apiClient } from '@/lib/axios';
import { ZodError } from 'zod';
import axios from 'axios';

const parseQuoteSummary = (data: unknown, context: string): QuoteSummary => {
  try {
    return QuoteSummarySchema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      console.error(`Zod validation failed in ${context}:`, err.flatten());
    } else {
      console.error(`Unexpected error while parsing data in ${context}:`, err);
    }
    throw new Error(`Failed to parse quote summary in ${context}`);
  }
};

export const getQuoteSummary = async (uuid: string): Promise<QuoteSummary> => {
  try {
    const { data } = await apiClient.get(`/pay/${uuid}/summary`);
    return parseQuoteSummary(data, 'getQuoteSummary');
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(` Axios error in getQuoteSummary [${uuid}]:`, err.response?.data || err.message);
      throw new Error('Network error while fetching quote summary');
    }

    console.error(' Unexpected error in getQuoteSummary:', err);
    throw err;
  }
};

export const updateQuoteSummary = async (uuid: string, currency: string): Promise<QuoteSummary> => {
  try {
    const { data } = await apiClient.put(`/pay/${uuid}/update/summary`, {
      currency,
      payInMethod: 'crypto',
    });

    return parseQuoteSummary(data, 'updateQuoteSummary');
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(` Axios error in updateQuoteSummary [${uuid}] with currency [${currency}]:`, err.response?.data || err.message);
      throw new Error('Network error while updating quote summary');
    }

    console.error(' Unexpected error in updateQuoteSummary:', err);
    throw err;
  }
};

export const acceptQuote = async (uuid: string): Promise<QuoteSummary> => {
  try {
    const { data } = await apiClient.put(`/pay/${uuid}/accept/summary`, {
      successUrl: 'no_url',
    });

    return parseQuoteSummary(data, 'acceptQuote');
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(` Axios error in acceptQuote [${uuid}]:`, err.response?.data || err.message);
      throw new Error('Network error while accepting quote');
    }

    console.error(' Unexpected error in acceptQuote:', err);
    throw err;
  }
};
