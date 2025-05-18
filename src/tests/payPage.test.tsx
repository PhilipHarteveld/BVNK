import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { selectedCurrencyAtom } from "@/state/atoms";
import PayQuotePage from "@/app/payin/[uuid]/pay/page";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ uuid: "mock-uuid" }),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/app/payin/[uuid]/hooks/useQuoteSummary", () => ({
  useQuoteSummary: () => ({
    data: {
      uuid: "mock-uuid",
      merchantDisplayName: "Mock Merchant",
      reference: "REF999",
      displayCurrency: { currency: "USD", amount: "200.00" },
      paidCurrency: { currency: "BTC", amount: "0.006" },
      acceptanceExpiryDate: Date.now() + 120000,
      expiryDate: Date.now() + 60000,
      quoteStatus: "PENDING",
      status: "ACTIVE",
      address: { address: "1BitcoinAddr999999999999" },
    },
  }),
}));

jest.mock("qrcode.react", () => ({
  QRCodeCanvas: () => <div data-testid="qrcode" />,
}));

jest.mock("@/hooks/useCountdownTimer", () => ({
  useCountdownTimer: () => ({
    timer: jest.fn(() => ({ clear: jest.fn() })),
    value: "00:45",
  }),
}));

describe("PayQuotePage", () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  it("renders quote and handles copy buttons", async () => {
    const store = createStore();
    store.set(selectedCurrencyAtom, "BTC");

    render(
      <Provider store={store}>
        <PayQuotePage />
      </Provider>
    );

    expect(await screen.findByText(/Pay with Bitcoin/)).toBeInTheDocument();
    expect(screen.getByText(/0.006 BTC/)).toBeInTheDocument();
    expect(screen.getByText(/Amount due/)).toBeInTheDocument();
    expect(screen.getByText(/Time left to pay/)).toBeInTheDocument();
    expect(screen.getByText("00:45")).toBeInTheDocument();

    const copyButtons = screen.getAllByRole("button", { name: /copy/i });

    fireEvent.click(copyButtons[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("0.006");

    fireEvent.click(copyButtons[1]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("1BitcoinAddr999999999999");
  });
});
