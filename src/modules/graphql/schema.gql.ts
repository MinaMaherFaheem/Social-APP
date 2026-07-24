import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userGQLSchema } from "../user";
import { postGqlSchema } from "../post";

const query = new GraphQLObjectType({
  name: "SchemaQuery",
  description: "optional text",
  fields: {
    ...userGQLSchema.registerQuery(),
    ...postGqlSchema.registerQuery(),
  },
});

const mutation = new GraphQLObjectType({
  name: "SchemaMutation",
  description: "hold all SchemaMutation fields",
  fields: {
    ...userGQLSchema.registerMutation(),
    ...postGqlSchema.registerMutation(),
  },
});

export const schema = new GraphQLSchema({ query, mutation });
