import { atom } from 'jotai';
import { QuoteSummary } from '../types/quote';


export const quoteAtom = atom<QuoteSummary | null>(null);