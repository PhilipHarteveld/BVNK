import React from 'react';
import { render, screen } from '@testing-library/react';
import ExpiredPage from '@/app/payin/[uuid]/expired/page';

describe('ExpiredPage', () => {
  it('renders expired payment message', () => {
    render(<ExpiredPage />);

    expect(
      screen.getByRole('heading', { name: /payment details expired/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/The payment details for your transaction have expired/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });
});
