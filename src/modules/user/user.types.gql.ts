import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GenderEnum, HUserDocument, ProviderEnum, RoleEnum } from "../../models";
import { GraphQlUniformResponse } from "../graphql/teypes.gql";


export const GraphQLGenderEnum = new GraphQLEnumType({
  name: "GraphQLGenderEnum",
  values: {
    male: { value: GenderEnum.male },
    female: { value: GenderEnum.female },
  },
});
export const GraphQLProviderEnum = new GraphQLEnumType({
  name: "GraphQLProviderEnum",
  values: {
    google: { value: ProviderEnum.GOOGLE },
    system: { value: ProviderEnum.SYSTEM },
  },
});
export const GraphQLRoleEnum = new GraphQLEnumType({
  name: "GraphQLRoleEnum",
  values: {
    superAdmin: { value: RoleEnum.superAdmin },
    admin: { value: RoleEnum.admin },
    user: { value: RoleEnum.user },
  },
});


export const GraphQLOneUserResponse = new GraphQLObjectType({
  name: "OneUserResponse",
  fields: {
    _id: {type: GraphQLID},
    
      firstName: {type: new GraphQLNonNull(GraphQLString)},
      lastName: {type: GraphQLString},
    username: {
      type: GraphQLString,
      resolve: (parent: HUserDocument) => {
        return parent.gender === GenderEnum.male ? `Mr:${parent.username}` : `Miss:${parent.username}`
      }
    },
    
      email: {type: GraphQLString},
      confirmEmailOtp: {type: GraphQLString},
      confirmedAt: {type: GraphQLString},
    
      password: {type: GraphQLString},
      resetPasswordOtp: {type: GraphQLString},
      changeCredentialsTime: {type: GraphQLString},
    
      phone: {type: GraphQLString},
      address: {type: GraphQLString},
      profileImage: {type: GraphQLString},
      temProfileImage: {type: GraphQLString},
      coverImages: {type: new GraphQLList(GraphQLString)},
    
      gender: {type: GraphQLGenderEnum},
      role: {type: GraphQLRoleEnum},
      provider: {type: GraphQLProviderEnum},
    
      freezedAt: {type: GraphQLString},
      freezedBy: {type: GraphQLID},
    
      restoredAt: {type: GraphQLString},
      restoredBy: {type: GraphQLID},
      friends:{type: new GraphQLList(GraphQLID)}, 
      blockList:{type: new GraphQLList(GraphQLID)}, 
    
      createdAt: {type: GraphQLString},
      updatedAt: {type: GraphQLString},
  },
});


export const welcome = new GraphQLNonNull(GraphQLString);
export const allUsers = new GraphQLList(GraphQLOneUserResponse);
export const search = GraphQlUniformResponse({
  name: "searchUser",
  data: new GraphQLNonNull(GraphQLOneUserResponse),
});
export const addFollower = new GraphQLList(GraphQLOneUserResponse);
