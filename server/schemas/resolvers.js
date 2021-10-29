const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id,
        })
          .select("-__v-password")
          .populate("books");

        return userData;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // users: async () => {
    //   return User.find().select("-__v -password").populate("savedBooks");
    // },
    // user: async (parent, { email }) => {
    //   return User.findOne({ email })
    //     .select("-__v -password")
    //     .populate("savedBooks");
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
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.log(err);
      }
    },

    loginUser: async (parent, { email, password }) => {
      try {
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
      } catch (err) {
        console.log(err);
      }
    },

    saveBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args.input } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    removeBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};
module.exports = resolvers;
