import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

import { z } from "zod";

const schema = z.object({
    user_id: z.string(),
})

export async function POST(request: Request){

    try{
        const json = await request.json();
        const body = schema.parse(json);
        console.log(json)

        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');

        const options = {
            projection: {
                "shift_id": 1,
                "shift_name": 1
            }
        };
        
        const shifts = await collection.find({"user_id" : body.user_id}, options).toArray();
        // console.log(shifts)
        return NextResponse.json({"message" : "success", "data": shifts});

    }catch(err){
        return NextResponse.error();
    }
}