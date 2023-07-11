import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

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
        const result = await collection.findOne({ shift_id: shift_id}, options)

        // console.log("load")
        console.log(result)
        return NextResponse.json(result);
    }catch(err){
        console.log(err);
        return NextResponse.error();
    }
}