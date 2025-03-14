'use server';
import db from "@/db"
import { TokenDetails } from "@/lib/schema";
import { date } from "zod";

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
        return { success: true, message: "Token created successfully!" };

    } catch (error) {
        return { success: false, message: "Token created failed!" };
    }
};

export const getToken = async (mint: string) => {
    try{
        let token = await db.token.findFirst({
            where: {
                token_mint : mint
            },
            include: {
                user:{
                    select:{
                        pubkey: true
                    }
                }
            }
        })
        return { success: true, data: token};

    }catch(err){
        return { success: false, message: "Failed to query token details!" };
        console.log("Error in `getToken`")
    }
}