"use client";

import { useParams } from "next/navigation";
import { useQuoteSummary } from "@/app/features/quote/hooks/useQuoteSummary";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAtomValue } from "jotai";
import { selectedCurrencyAtom } from "@/app/state/atoms";

const currencyLabels: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  LTC: "Litecoin",
};

export default function PayQuotePage() {
  const { uuid } = useParams() as { uuid: string };
  const { data: quote } = useQuoteSummary(uuid);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const selectedCurrency = useAtomValue(selectedCurrencyAtom);
  const currency = selectedCurrency || quote?.paidCurrency.currency;

  useEffect(() => {
    if (!quote?.expiryDate) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const secondsLeft = Math.floor((quote.expiryDate - now) / 1000);

      if (secondsLeft <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
        return;
      }

      const hrs = Math.floor(secondsLeft / 3600).toString().padStart(2, "0");
      const mins = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, "0");
      const secs = (secondsLeft % 60).toString().padStart(2, "0");

      setTimeLeft(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [quote?.expiryDate]);

  if (!quote) return <div className="p-8">Loading...</div>;

  const amount = quote.paidCurrency.amount;
  const address = quote.address?.address ?? "Unknown";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskedAddress =
    address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-5)}`
      : address;

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
          <span className=" text-textHeading">Amount due</span>
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
          <span className=" text-textHeading">{currency} address</span>
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
