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
            projection: { 
                "shifts": 0, 
                "name_list": 0, 
                "constraints" : 0, 
                "days_off_index": 0, 
                "computation_time": 0, 
                "scores": { $slice: [parseInt(id), 1] } 
            }
        }
        const result = await collection.findOne({ shift_id: "9c87a528-44f8-439e-aea3-c4c68dda2bdc" }, options)

        // console.log("load")
        // console.log(result)
        return NextResponse.json(result);
    }catch(err){
        console.log(err);
        return NextResponse.error();
    }
}