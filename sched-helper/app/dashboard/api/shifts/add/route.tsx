import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

import { z } from "zod";
import {v4 as uuidv4} from 'uuid';
import { unique } from "next/dist/build/utils";

const schema = z.object({
    name: z.string(),
})

export async function GET(request: Request){
    return NextResponse.json({"shift_id": "success"})
}

export async function POST(request: Request){
    try{
        const json = await request.json(); 
        const body = schema.parse(json);
        console.log(body);

        // generate a unique ID for the shift
        const uniqueId = uuidv4();
        console.log(uniqueId) 

        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');
        await collection.insertOne({shift_name: body.name, shift_id: uniqueId});
        return NextResponse.json({"shift_id": uniqueId});
    }catch(err){
        console.log(err);
        return NextResponse.error();
    }
}
