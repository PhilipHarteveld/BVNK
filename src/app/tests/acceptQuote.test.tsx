import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { selectedCurrencyAtom } from '@/app/state/atoms';
import AcceptQuotePage from '@/app/payin/[uuid]/page';

jest.mock('next/navigation', () => ({
  useParams: () => ({ uuid: 'mock-uuid' }),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/app/features/quote/api', () => ({
  acceptQuote: jest.fn(() => Promise.resolve()),
  updateQuoteSummary: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/app/features/quote/hooks/useQuoteSummary', () => ({
  useQuoteSummary: () => ({
    data: {
      uuid: 'mock-uuid',
      merchantDisplayName: 'Mock Merchant',
      reference: 'REF123',
      displayCurrency: { currency: 'USD', amount: '100.00' },
      paidCurrency: { currency: 'BTC', amount: '0.003' },
      acceptanceExpiryDate: Date.now() + 60000,
      quoteStatus: 'PENDING',
      status: 'ACTIVE',
      address: { address: '1BitcoinAddressABCXYZ' },
    },
    refetch: jest.fn(),
  }),
}));

describe('AcceptQuotePage', () => {
  it('renders quote details and handles confirm', async () => {
    const store = createStore();
    store.set(selectedCurrencyAtom, 'BTC');

    render(
      <Provider store={store}>
        <AcceptQuotePage />
      </Provider>
    );

    expect(await screen.findByText('Mock Merchant')).toBeInTheDocument();
    expect(screen.getByText('USD 100.00')).toBeInTheDocument();
    expect(screen.getByText(/REF123/)).toBeInTheDocument();
    expect(screen.getByText(/0.003 BTC/)).toBeInTheDocument();
    expect(screen.getByText(/Amount due/)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/Quoted price expires in/)).toBeInTheDocument()
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(confirmButton).toBeInTheDocument();
    });
  });
});
