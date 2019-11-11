const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const db = require("./db");

// Create the graphQl Yoga Server

function createServer() {
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: {
      // destructured es6
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    // Available as `ctx` in Mutations.js and Query.js
    context: req => ({ ...req, db })
  });
}

module.exports = createServer;
