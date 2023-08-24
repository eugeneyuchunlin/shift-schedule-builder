import clientPromise from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

import { z } from "zod";

const constraintSchema = z.object({
    name: z.string(),
    parameters: z.record(z.string()),
  });

const schema = z.object({
    shift_id: z.string(),
    computation_time: z.number(),
    name_list: z.array(z.string()),
    shift: z.array(z.array(z.string())),
    constraints: z.array(constraintSchema),
    reserved_leave: z.record(z.array(z.number())),
    algorithm: z.number()
})

export async function POST(request: Request){
    try{

        const json = await request.json();
        const body = schema.parse(json);

        console.log(body);

        const client = await clientPromise;
        const db = await client.db();
        const collection = await db.collection('shifts');

        const filter = {shift_id: body.shift_id};
        const updateDoc = { 
            $set: {
                computation_time: body.computation_time,
                name_list: body.name_list,
                "shifts.0": body.shift,
                constraints: body.constraints,
                reserved_leave: body.reserved_leave,
                algorithm: body.algorithm
            },
        };
        const option = {
            upsert: true
        }
        const result = await collection.updateOne(filter, updateDoc, option);

        return NextResponse.json({"message": "success"});
    }catch(err){
        console.log(err);
        return NextResponse.error();
    }
}