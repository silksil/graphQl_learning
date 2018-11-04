const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data)
      }
    }
  })
});

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
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
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
       * parentValue: an argument looks to the current type you are using
       * args: stands for arguments, basically include the argument defined above in it
      */
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Describe the operation it's gonna execute
    addUser: {
      // Refers to the type of data we eventually will resolve (not the type we give)
      type: UserType,
      args: {
        // Here we define with GraphQLNonNull that name is required. If not, throws error.
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post('http://localhost:3000/users', { firstName, age  })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(res => res.data)
      }
    }
  }
});

// takes in a root query and returns a GraphQl instance
module.exports = new GraphQLSchema({
  mutation,
  query: RootQuery
});
