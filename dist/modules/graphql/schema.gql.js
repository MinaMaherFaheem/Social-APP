"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const user_schema_gql_1 = require("../user/user.schema.gql");
const query = new graphql_1.GraphQLObjectType({
    name: "SchemaQuery",
    description: "optional text",
    fields: {
        ...user_schema_gql_1.userGQLSchema.registerQuery()
    }
});
const mutation = new graphql_1.GraphQLObjectType({
    name: "SchemaMutation",
    description: "hold all SchemaMutation fields",
    fields: {
        ...user_schema_gql_1.userGQLSchema.registerMutation()
    }
});
exports.schema = new graphql_1.GraphQLSchema({ query, mutation });
//# sourceMappingURL=schema.gql.js.map