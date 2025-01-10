const typeDefs = `#graphql
    type User {
        _id: String
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]!
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    input BookInput {
        bookId: String!
        authors: [String!]
        description: String!
        title: String!
        image: String!
        link: String!
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
        user(username: String): User
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        loginUser(email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;

export default typeDefs;
