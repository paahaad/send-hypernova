'use server';
import db from "@/db"

export const createToken = async (
    name: string,
    symbol: string,
    url: string,
    mint: string,
    userPubkey: string,
    mintAuthority: string
) => {
    try {
        let user = await db.user.findFirst({
            where: { pubkey: userPubkey },
        });
        if (!user) {
            user = await db.user.create({
                data: {
                    name: `User_${Math.random().toString(36).substring(2, 8)}`,
                    pubkey: userPubkey
                }
            });
        }

        await db.token.create({
            data: {
                name,
                symbol,
                url,
                userId: user.id,
                mint,
                presalePool: mintAuthority
            }
        });

        console.log("Token created successfully!");
    } catch (error) {
        console.error("Error creating token:", error);
    }
};
