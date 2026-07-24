"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFollower = exports.search = exports.allUsers = exports.wellcome = exports.GraphQLOneUserResponse = exports.GraphQLGenderEnum = void 0;
const graphql_1 = require("graphql");
const models_1 = require("../../models");
const teypes_gql_1 = require("../graphql/teypes.gql");
exports.GraphQLGenderEnum = new graphql_1.GraphQLEnumType({
    name: "GraphQLGenderEnum",
    values: {
        male: { value: models_1.GenderEnum.male },
        female: { value: models_1.GenderEnum.female },
    },
});
exports.GraphQLOneUserResponse = new graphql_1.GraphQLObjectType({
    name: "OneUserResponse",
    fields: {
        id: { type: graphql_1.GraphQLID },
        name: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            description: "userName",
        },
        email: { type: graphql_1.GraphQLString },
        gender: { type: exports.GraphQLGenderEnum },
        followers: { type: new graphql_1.GraphQLList(graphql_1.GraphQLID) },
    },
});
exports.wellcome = new graphql_1.GraphQLNonNull(graphql_1.GraphQLString);
exports.allUsers = new graphql_1.GraphQLList(exports.GraphQLOneUserResponse);
exports.search = (0, teypes_gql_1.GraphQlUniformResponse)({
    name: "searchUser",
    data: new graphql_1.GraphQLNonNull(exports.GraphQLOneUserResponse),
});
exports.addFollower = new graphql_1.GraphQLList(exports.GraphQLOneUserResponse);
//# sourceMappingURL=user.types.gql.js.map