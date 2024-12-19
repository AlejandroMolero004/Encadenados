import { ObjectId } from "mongodb";

export type userdb={
    _id?:ObjectId
    name:string
    email:string
    friends:ObjectId[]
}
export type user={
    id:string
    name:string
    email:string
    friends:user[]
    numberofFriends:number
}