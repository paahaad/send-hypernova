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
    .number()
    .min(0, {
      message: "decimals should be between 0 to 8",
    })
    .max(8, {
      message: "decimals should be between 0 to 8",
    }),
  totalSupply: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be positive",
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
      required_error: "Reqired",
    })
    .url({
      message: "Enter valid url",
    }),
  // logo: z.string().optional(),
});
