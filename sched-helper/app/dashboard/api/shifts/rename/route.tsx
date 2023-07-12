import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

import { z } from "zod";

const schema = z.object({
    name: z.string(),
    shift_id: z.string(),
})

export async function POST(request: Request){
    try{
        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');


        const json = await request.json();
        const body = schema.parse(json);

        const filter = {shift_id: body.shift_id};
        const options = {
            upsert: true
        }
        const updateDoc = {
            $set: {
                shift_name: body.name,
            },
        };

        const result = await collection.updateOne(filter, updateDoc, options);
        return NextResponse.json({"message": "success"});
    }catch(err){
        console.log(err);
        return NextResponse.error();
    }
}