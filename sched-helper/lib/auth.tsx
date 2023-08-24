import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter, MongoDBAdapterOptions, defaultCollections, format } from "@auth/mongodb-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from '@/lib/mongodb'
import { type 
    Adapter, 
    AdapterUser,
    AdapterAccount,
    AdapterSession,
    VerificationToken,
} from "next-auth/adapters";
import { MongoClient } from "mongodb";



export function MONGODBAdapter(
    client: Promise<MongoClient>,
    options: MongoDBAdapterOptions = {}
): Adapter {
    const { from, to } = format;

    const adapter = MongoDBAdapter(client, options);

    // some code from the next-auth mongodb adapter
    const db = (async ()=> {
        const _db = (await client).db(options.databaseName)
        const c = {...defaultCollections, ...options.collections}
        return {
            U: _db.collection(c.Users),
            A: _db.collection(c.Accounts),
            S: _db.collection(c.Sessions),
            V: _db.collection(c.VerificationTokens),
        }
    })();

  
    return {
      ...adapter,
      async createUser(profile) {
        // Custom implementation for createUser
        console.log(profile)
        console.log("insert my own user")
        const user = to<AdapterUser>(profile);
        const user_data =  {
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          plan: 'free',
          shifts: [],
        };

        await (await db).U.insertOne(user_data)
        return from<AdapterUser>(user_data);
      },
    } as Adapter;
  }


export const AuthOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        })
    ],
    adapter: MONGODBAdapter(clientPromise, {
        databaseName: 'test',
    } as MongoDBAdapterOptions),
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log("user : ", user ? user : account?.user)
            // console.log('account : ', account)
            // console.log('profile: ', profile)
            // console.log("email: ", email)
            return true
        },
        async session({ session, token, user }) {
            console.log("session : ", session)
            console.log("token : ", token)
            console.log("user : ", user)
            session.user = user;
            return session
        }
    },
}
