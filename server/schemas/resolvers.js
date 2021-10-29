const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("books");
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // users: async () => {
    //   return User.find().populate("books");
    // },
    // user: async (parent, { username }) => {
    //   return User.findOne({ username }).populate("books");
    // },

    // books: async (parent, { username }) => {
    //   const params = username ? { username } : {};
    //   return Book.find(params);
    // },

    // book: async (parent, { bookId }) => {
    //   return Book.findOne({ bookId: bookId });
    // },
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Invalid Login");
      }
      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Invalid Login");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};
module.exports = resolvers;
