import { GraphQLEnumType, GraphQLList, GraphQLNonNull, GraphQLObjectType } from "graphql";
export declare const GraphQLGenderEnum: GraphQLEnumType;
export declare const GraphQLOneUserResponse: GraphQLObjectType<any, any>;
export declare const wellcome: GraphQLNonNull<import("graphql").GraphQLScalarType<string, string>>;
export declare const allUsers: GraphQLList<GraphQLObjectType<any, any>>;
export declare const search: import("graphql").GraphQLOutputType;
export declare const addFollower: GraphQLList<GraphQLObjectType<any, any>>;
//# sourceMappingURL=user.types.gql.d.ts.map