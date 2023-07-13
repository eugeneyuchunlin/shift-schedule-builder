import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
    shift_id: z.string(),
});

export async function POST(request: Request){
    try{
        const body = await request.json();
        const { shift_id } = schema.parse(body);
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("shifts");
        const result = await collection.deleteOne({ shift_id: shift_id });
        return NextResponse.json({message: "success"});
    }catch(err){
        console.log(err)
        return NextResponse.error();
    }
}