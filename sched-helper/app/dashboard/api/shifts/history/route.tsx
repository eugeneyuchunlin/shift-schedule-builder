import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request){
    try{
        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');
        const shifts = await collection.find({}).toArray();
        return NextResponse.json({"message" : "success", "data": shifts});

    }catch(err){
        return NextResponse.error();
    }
}