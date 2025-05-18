
import { useQuery } from "@tanstack/react-query";
import { getQuoteSummary } from "../../../../quote/api";

export const useQuoteSummary = (uuid: string) =>
  useQuery({
    queryKey: ["quote", uuid],
    queryFn: () => getQuoteSummary(uuid),
    refetchInterval: 30000,
    enabled: !!uuid,        });