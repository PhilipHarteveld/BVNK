"use client";

import { useAtom } from "jotai";
import { selectedCurrencyAtom } from "@/state/atoms";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const currencies = [
  { label: "Bitcoin", value: "BTC" },
  { label: "Ethereum", value: "ETH" },
  { label: "Litecoin", value: "LTC" },
];

export const CurrencyDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom);

  const handleSelect = (currentValue: string) => {
    setSelectedCurrency(currentValue);
    setOpen(false);
  };

  const selectedLabel =
    currencies.find((c) => c.value === selectedCurrency)?.label || "Select currency...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full  justify-between rounded-lg px-16 py-8 text-lg font-medium border border-gray-200 bg-white text-neutral-900 shadow-sm hover:bg-whit"
          )}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 mt-2 rounded-lg border border-gray-200 shadow-md bg-white">
        <Command>
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={handleSelect}
                  className="px-4 py-2 cursor-pointer"
                >
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
