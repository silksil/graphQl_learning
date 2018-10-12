const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

const users = [
  { id: '23', firstName: 'Bill', age: 20 },
  { id: '47', firstName: 'Samantha', age: 21 }
];

//
const UserType = new GraphQLObjectType({
  /*
   * GraphQLObjectType always has two required properties
   * Name is a capital string that describes the type we are defining, mostly equal to const
   * Field describes the different properties. Every property should include the type
  */
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

/*
 * A root query allows us to jump is in a certain part of the Graph
 * You can see it as an entry point into our data
*/
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {

    // 1.) if you are looking for a user
    user: {
      // 3. I give back to you a user
      type: UserType,
      /*
       * args stands for arguments that you have to provide to give something back,
       * 2. if you give me a id
      */
      args: { id: { type: GraphQLString } },
      /*
       * resolve:  purpose is to actually get the data from the DB
       * parentValue: an argument that is hardly being used
       * args: stands for arguments, basically include the argument defined above in it
      */
      resolve(parentValue, args) {
        return _.find(users, { id: args.id });
      }
    }
  }
});

// takes in a root query and returns a GraphQl instance
module.exports = new GraphQLSchema({
  query: RootQuery
});
