import { render, screen } from '@testing-library/react';
import { AmountDisplay } from '../components/ui/amountDisplay';


describe('AmountDisplay', () => {
  it('renders the amount and currency', () => {
    render(<AmountDisplay amount={0.0075} currency="BTC" />);
    expect(screen.getByText(/0.0075 BTC/)).toBeInTheDocument();
  });
});