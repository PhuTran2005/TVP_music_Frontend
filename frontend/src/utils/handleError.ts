import { ApiErrorResponse } from "@/types";
import { toast } from "sonner";

export const handleError = (err: unknown, defaultMessage: string) => {
  const error = err as ApiErrorResponse;
  const message = error.response?.data?.message || defaultMessage;
  toast.error(message);
};
