import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request){
    try{
        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');
        const options = {
            projection: {
                "shift_id": 1,
                "shift_name": 1
            }
        };
        
        const shifts = await collection.find({}, options).toArray();
        // console.log(shifts)
        return NextResponse.json({"message" : "success", "data": shifts});

    }catch(err){
        return NextResponse.error();
    }
}