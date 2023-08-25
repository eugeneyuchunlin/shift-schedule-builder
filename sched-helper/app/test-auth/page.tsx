import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/auth";


export default async function Page(){

    const sessions = await getServerSession(AuthOptions)
    console.log(sessions)
    return (
        <>
            {JSON.stringify(sessions)}
        </>
    )
}