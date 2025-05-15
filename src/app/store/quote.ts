import { atom } from 'jotai';
import type { QuoteSummary } from '@/types/quote';

export const quoteAtom = atom<QuoteSummary | null>(null);