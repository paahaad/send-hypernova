'use server';
import db from "@/db"
import { TokenDetails } from "@/lib/schema";

export const createToken = async (values: TokenDetails) => {
    try {
        let user = await db.user.findFirst({
            where: { pubkey: values.user },
        });
        if (!user) {
            user = await db.user.create({
                data: {
                    name: `User_${Math.random().toString(36).substring(2, 8)}`,
                    pubkey: values.user
                }
            });
        }

        await db.token.create({
            data: {
                name: values.tokenName,
                symbol: values.tokenSymbol,
                url: values.tokenUrl,
                userId: user.id,

                ticker: values.ticker,
                price: values.price,
                sale_start: values.sale_start,
                sale_end: values.sale_end,

                min_purchase: values.min_purchase,
                max_purchase: values.max_purchase,
              
                token_mint: values.token_min,
                associated_token_presale: values.associated_token_presale
            }
        });

        console.log("Token created successfully!");
    } catch (error) {
        console.error("Error creating token:", error);
    }
};
