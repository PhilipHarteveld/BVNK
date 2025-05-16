import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AmountDisplay } from '../components/ui/amountDisplay';


describe('AmountDisplay', () => {
  it('renders the amount and currency', () => {
    render(<AmountDisplay amount={0.0075} currency="BTC" />);
    expect(screen.getByText(/0.0075 BTC/)).toBeInTheDocument();
    expect(screen.getByText(/Amount Due/)).toBeInTheDocument();
  });

  it('copies amount to clipboard when button is clicked', async () => {

    const writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<AmountDisplay amount={0.0075} currency="BTC" />);

    const button = screen.getByRole('button', { name: /0.0075 BTC/ });
    fireEvent.click(button);

    expect(writeTextMock).toHaveBeenCalledWith('0.0075');
  });
});
