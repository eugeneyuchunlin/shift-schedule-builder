import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

import { z } from "zod";

export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const shift_id = searchParams.get('shift_id');
    try{
        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');

        const result = await collection.findOne({shift_id: shift_id});
        // console.log(result)
        return NextResponse.json(result);
    }catch(err){
        console.log(err);
        return NextResponse.error();
    }
}