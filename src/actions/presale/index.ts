'use server'

import db from "@/db"

export const getPresale = async (page: number = 1, pageSize: number = 10) => {
    try {
        const skip = (page - 1) * pageSize;
        const allToken = await db.token.findMany({
            skip,
            take: pageSize,
        });

        const totalRecords = await db.token.count(); // Get total count for pagination metadata
        const totalPages = Math.ceil(totalRecords / pageSize);

        return {
            data: allToken,
            meta: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize,
            },
        };
    } catch (error) {
        console.log("[Error in: `getPresale` action]", error);
        throw error;
    }
};
