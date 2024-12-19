import{MongoClient}from "mongodb"
import { userdb } from "./types.ts";
import {ApolloServer} from "@apollo/server"
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
const MONGO_URL=Deno.env.get("MONGO_URL")

if(!MONGO_URL){
  throw new Error("Mongo url is not set")
}

const client= new MongoClient(MONGO_URL)
await client.connect()

const db=client.db("users")
const userscollection=db.collection<userdb>("users")

const server= new ApolloServer({
  typeDefs:schema,resolvers
})
const{url}=await startStandaloneServer(server,{context:async () =>({userscollection}),
})
console.log(url)