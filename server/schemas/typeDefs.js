const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Book {
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
  input savedBook {
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
  type Query {
    me: User
  }

  type Mutation {
    loginUser(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: savedBook!): User
    removeBook(bookId: ID!): User
  }
`;
module.exports = typeDefs;
