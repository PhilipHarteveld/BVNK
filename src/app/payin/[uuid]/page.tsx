"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteSummary } from "@/app/payin/[uuid]/hooks/useQuoteSummary";
import { acceptQuote, updateQuoteSummary } from "@/quote/api";

import { useAtom } from "jotai";
import { selectedCurrencyAtom } from "@/state/atoms";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { CurrencyDropdown } from "@/molecules/ui/currencyDropdown";

export default function AcceptQuotePage() {
  const { uuid } = useParams() as { uuid: string };
  const router = useRouter();
  const { data: quote, refetch } = useQuoteSummary(uuid);
  const [selectedCurrency] = useAtom(selectedCurrencyAtom);
  const { timer, value: timeLeft } = useCountdownTimer("hh:mm:ss");

  const redirect = useCallback(() => {
    router.push(`/payin/${uuid}/expired`);
    return null;
  }, [uuid, router]);

  useEffect(() => {
    if (selectedCurrency) {
      updateQuoteSummary(uuid, selectedCurrency).then(() => refetch());
    }
  }, [selectedCurrency, uuid, refetch]);

  useEffect(() => {
    if (!quote?.acceptanceExpiryDate) return;
    const { clear } = timer(quote.acceptanceExpiryDate, 1000, redirect);

    return () => {
      clear();
    };

  }, [quote?.acceptanceExpiryDate]);

  if (!quote?.uuid) return <div className="p-8">Loading...</div>;

  if (quote.status === "EXPIRED") {
    router.push(`/payin/${uuid}/expired`);
    return null;
  }

  if (quote.quoteStatus === "ACCEPTED") {
    router.push(`/payin/${uuid}/pay`);
    return null;
  }

  const handleConfirm = async () => {
    await acceptQuote(uuid);
    router.push(`/payin/${uuid}/pay`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f9] px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <div className="text-center mb-4">
          <p className="text-textColor font-medium text-[20px] ">
            {quote.merchantDisplayName}
          </p>
          <p className="text-4xl font-bold mt-1 text-[32px] text-textColor">
            {quote?.displayCurrency?.currency} {quote?.displayCurrency?.amount}
          </p>
          <p className="text-sm mt-2 text-gray-500">
            For reference number:{" "}
            <span className="font-semibold">{quote.reference}</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-textColor mb-1 text-[14px]">
            Pay with
          </label>
          <CurrencyDropdown />
        </div>

        {selectedCurrency &&
          quote?.paidCurrency?.currency &&
          Number(quote?.paidCurrency?.amount) > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-600 flex justify-between pt-4 border-b pb-4 border-t ">
                <span>Amount due</span>
                <span className="font-medium">
                  {quote.paidCurrency.amount} {quote.paidCurrency.currency}
                </span>
              </div>

              <div className="text-sm text-gray-600 flex justify-between pt-4 border-b pb-4">
                <span>Quoted price expires in</span>
                <span className="font-medium">{timeLeft}</span>
              </div>
            </div>
          )}

        {selectedCurrency && (
          <Button
            onClick={handleConfirm}
            className="mt-6 w-full bg-primaryButton text-white"
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  );
}