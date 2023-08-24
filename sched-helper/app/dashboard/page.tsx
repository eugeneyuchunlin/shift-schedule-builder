import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";
import ScheduleBuilder from "./shift_builder";
import { redirect } from 'next/navigation';
import { Auth } from "@auth/core";

export default async function Page(){

    const session = await getServerSession(AuthOptions);
    if(!session){
        redirect('/');
    } 
    return (
        <ScheduleBuilder user={session}></ScheduleBuilder>
    )
}