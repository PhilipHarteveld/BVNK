"use client";

import { useParams } from "next/navigation";
import { useQuoteSummary } from "@/app/payin/[uuid]/hooks/useQuoteSummary";
import { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAtomValue } from "jotai";
import { selectedCurrencyAtom } from "@/state/atoms";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";

const currencyLabels: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  LTC: "Litecoin",
};

export default function PayQuotePage() {
  const { uuid } = useParams() as { uuid: string };
  const { data: quote } = useQuoteSummary(uuid);

  const selectedCurrency = useAtomValue(selectedCurrencyAtom);

  // Ensure these hooks are always called, even if quote is undefined
  const expiryDate = quote?.expiryDate;
  const currency = selectedCurrency || quote?.paidCurrency.currency;
  const amount = quote?.paidCurrency.amount;
  const address = quote?.address?.address ?? "Unknown";

  const timeLeft = useCountdownTimer(expiryDate, "hh:mm:ss");

  const maskedAddress = useMemo(() => {
    return address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-5)}`
      : address;
  }, [address]);

  // Now it's safe to return early
  if (!quote) return <div className="p-8">Loading...</div>;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f9] px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md text-center">
        <h2 className="text-lg font-medium mb-2 text-textColor">
          Pay with {currencyLabels[currency as string] || currency}
        </h2>

        <p className="text-sm text-textHeading mb-6">
          To complete this payment send the amount due to the {currency} address provided below.
        </p>

        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="text-textHeading">Amount due</span>
          <span className="font-semibold text-textColor">
            {amount} {currency}
            <button
              onClick={() => handleCopy(`${amount}`)}
              className="ml-2 text-blue-600 text-xs"
            >
              Copy
            </button>
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="text-textHeading">{currency} address</span>
          <span className="font-semibold text-textColor">
            {maskedAddress}
            <button
              onClick={() => handleCopy(address)}
              className="ml-2 text-blue-600 text-xs"
            >
              Copy
            </button>
          </span>
        </div>

        <div className="flex justify-center my-4">
          <QRCodeCanvas value={address} size={128} />
        </div>

        <div className="text-xs text-gray-500 break-all mb-6">{address}</div>

        <div className="flex justify-between text-sm text-gray-600 border-t pt-4 border-b pb-4">
          <span>Time left to pay</span>
          <span className="font-semibold">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}
