import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

import { z } from "zod";

export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const shift_id = searchParams.get('shift_id');
    let id = searchParams.get('index');
    if(id === null){
        id = "0";
    } 
    // var id_int = ;
    // console.log(id)
    try{
        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');
        const options = {
            projection: { "shifts": { $slice: [parseInt(id), 1] }, "scores": { $slice: [parseInt(id), 1] } }
        }
        const result = await collection.findOne({ shift_id: "9c87a528-44f8-439e-aea3-c4c68dda2bdc" }, options)

        // console.log("load")
        console.log(result)
        return NextResponse.json(result);
    }catch(err){
        console.log(err);
        return NextResponse.error();
    }
}