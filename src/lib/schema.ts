import * as z from "zod";

export const tokenFormSchema = z.object({
  name: z.string().min(3, {
    message: "Min 3 characters",
  }),
  symbol: z
    .string()
    .min(2, {
      message: "Min 2 characters",
    })
    .max(8, {
      message: "Max 8 characters",
    }),
  decimals: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val) && val >= 0 && val <= 8, {
      message: "Decimals should be between 0 to 8",
    }),
  totalSupply: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, {
      message: "Must be a positive number",
    }),
  description: z
    .string()
    .min(10, {
      message: "Min 10 characters",
    })
    .max(500, {
      message: "Max 500 characters",
    }),
  blockchain: z.string({
    required_error: "Required",
  }),
  tokenType: z.string({
    required_error: "Required",
  }),
  uri: z
    .string({
      required_error: "Required",
    })
    .url({
      message: "Enter a valid URL",
    }),
  startTime: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Invalid number",
    }),
  endTime: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Invalid number",
    }),
  ticker: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val), {
      message: "Invalid number",
    }),
  tokenPrice: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, {
      message: "Must be a positive number",
    }),
  minPurchase: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, {
      message: "Must be a positive number",
    }),
  maxPurchase: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, {
      message: "Must be a positive number",
    }),
  presalePercentage: z
    .string()
    .transform(Number)
    .refine((val) => val >= 0 && val <= 100, {
      message: "Must be between 0 and 100",
    }),
});
