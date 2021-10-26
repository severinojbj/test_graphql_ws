import { Resolvers } from "../defs.global";
import { UsersAPI } from "../datasource/user";

const { GraphQLScalarType } = require("graphql");

const usersAPI = new UsersAPI();

export const resolvers: Resolvers = {
  Datetime: new GraphQLScalarType({
    name: "Datetime",
    description: "String de data e hora no formato ISO-8611",
    serialize: (value: { toISOString: (arg0: any) => any }) =>
      value.toISOString(value),
    parseValue: (value: string | number | Date) => new Date(value),
    parseLiteral: (ast: { value: string | number | Date }) =>
      new Date(ast.value),
  }),

  Query: {
    users: () => usersAPI.getUsers(),
    // firstUser: () => arrayUsers [0]
    user: (_: any, { id }: any) => usersAPI.getUserById(id),
  },
  Mutation: {
    addUser: async (_: any, user: any) => {
      console.log(user);
      return UsersAPI.addUser(user);
    },
    updateUser: (_: any, user: any) => usersAPI.updateUser(user),
    deleteUser: (_: any, { id }: any) => usersAPI.deleteUser(id),
  },
};
