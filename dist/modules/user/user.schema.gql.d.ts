declare class UserGQLSchema {
    private userResolver;
    constructor();
    registerQuery: () => {
        sayHi: {
            type: import("graphql").GraphQLNonNull<import("graphql").GraphQLScalarType<string, string>>;
            description: string;
            resolve: (parent: unknown, args: any) => string;
        };
        allUsers: {
            type: import("graphql").GraphQLList<import("graphql").GraphQLObjectType<any, any>>;
            args: {
                name: {
                    type: import("graphql").GraphQLNonNull<import("graphql").GraphQLScalarType<string, string>>;
                };
                gender: {
                    type: import("graphql").GraphQLEnumType;
                };
            };
            resolve: (parent: unknown, args: {
                name: string;
                gender: import("../../models").GenderEnum;
            }) => import("./user.service").IUser[];
        };
        searchUser: {
            type: import("graphql").GraphQLOutputType;
            args: {
                email: {
                    type: import("graphql").GraphQLNonNull<import("graphql").GraphQLScalarType<string, string>>;
                    description: string;
                };
            };
            resolve: (parent: unknown, args: {
                email: string;
            }) => {
                message: string;
                statusCode: number;
                data: import("./user.service").IUser;
            };
        };
    };
    registerMutation: () => {
        addFollower: {
            type: import("graphql").GraphQLList<import("graphql").GraphQLObjectType<any, any>>;
            args: {
                friendId: {
                    type: import("graphql").GraphQLNonNull<import("graphql").GraphQLScalarType<number, number>>;
                };
                myId: {
                    type: import("graphql").GraphQLNonNull<import("graphql").GraphQLScalarType<number, number>>;
                };
            };
            resolve: (parent: unknown, args: {
                friendId: number;
                myId: number;
            }) => import("./user.service").IUser[];
        };
    };
}
export declare const userGQLSchema: UserGQLSchema;
export {};
//# sourceMappingURL=user.schema.gql.d.ts.map