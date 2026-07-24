import { GraphQLNonNull } from "graphql";
export declare const allUsers: {
    name: {
        type: GraphQLNonNull<import("graphql").GraphQLScalarType<string, string>>;
    };
    gender: {
        type: import("graphql").GraphQLEnumType;
    };
};
export declare const search: {
    email: {
        type: GraphQLNonNull<import("graphql").GraphQLScalarType<string, string>>;
        description: string;
    };
};
export declare const addFollower: {
    friendId: {
        type: GraphQLNonNull<import("graphql").GraphQLScalarType<number, number>>;
    };
    myId: {
        type: GraphQLNonNull<import("graphql").GraphQLScalarType<number, number>>;
    };
};
//# sourceMappingURL=user.args.gql.d.ts.map