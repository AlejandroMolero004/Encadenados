import { Collection,ObjectId } from "mongodb";
import { userdb } from "./types.ts";
import { GraphQLError } from "graphql";

type context={
    userscollection:Collection<userdb>
}
type QueryUserArgs={
    email:string
}
type mutationAddUserArgs={
    email:string,
    name:string,
    friends:string[]
}


export const resolvers={
   user:{
        id:(parent:userdb)=>{
            return parent._id?.toString();
        },
        friends:async(parent:userdb,_:unknown,ctx:context)=>{
            const ids=parent.friends
            return await ctx.userscollection.find({_id:{$in:ids}}).toArray()
        },
        numberofFriends:(parent:userdb)=>parent.friends.length
   },
   Query:{
        users:async(_:unknown,__:unknown,ctx:context):Promise<userdb[]>=>{
        const users=await ctx.userscollection.find().toArray()
        return users
        },
        user:async(_:unknown,args:QueryUserArgs,ctx:context):Promise<userdb|null>=>{
            const user=await ctx.userscollection.findOne({email:args.email})
            return user
        }
   },
   Mutation:{
        adduser:async(_:unknown,args:mutationAddUserArgs,ctx:context):Promise<userdb>=>{
            const userdb=await ctx.userscollection.findOne({email:args.email})
            if(userdb){
                throw new GraphQLError("User Exists")
            }
            const friends=await ctx.userscollection.find({
                _id:{$in:args.friends.map((f)=>new ObjectId(f))}
            }).toArray()
            if(friends.length!==args.friends.length){
                throw new GraphQLError("Not all friends Exists")
            }
            const{insertedId}=await ctx.userscollection.insertOne({
                name:args.name,
                email:args.email,
                friends:friends.map((f)=>new ObjectId(f._id))
            })
            return {
                _id:insertedId,
                name:args.name,
                email:args.email,
                friends:friends.map((f)=>new ObjectId(f._id))
            }
        }
   }



}