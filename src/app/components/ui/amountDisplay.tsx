import { Button } from '@/components/ui/button';

type Props = {
  amount: number;
  currency: string;
};

export const AmountDisplay = ({ amount, currency }: Props) => (
  <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
    <span className="text-lg font-medium">Amount Due</span>
    <Button
      onClick={() => navigator.clipboard.writeText(`${amount}`)}
      variant="outline"
    >
      {amount} {currency}
    </Button>
  </div>
);