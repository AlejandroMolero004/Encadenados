export const schema=`#graphql
    type user {
        id:ID!
        name:String!
        email:String!
        friends:[user!]!
        numberofFriends:Int!
    }
    type Query{
        users:[user!]!
        user(email:String!):user
    }
    type Mutation{
        adduser(name:String!,email:String!,friends:[ID!]!):user!
        addfriend(user:ID!,friend:ID!):user!
    }






`






