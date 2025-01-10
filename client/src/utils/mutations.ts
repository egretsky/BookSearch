import {gql} from '@apollo/client';

export const LOGIN_USER= gql `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
  }
}
`; 
export const ADD_USER=gql`
mutation AddUser($input: UserInput!) {
  addUser(input: $input) {
    token
  }
}
`;

export const SAVE_BOOK = gql `
    mutation Mutation($input: BookInput!) {
        saveBook(input: $input) {
            _id
            bookCount
            email
            username
        }
    }
`;

export const REMOVE_BOOK = gql `
    mutation Mutation($bookId: ID!) {
        removeBook(bookId: $bookId) {
            _id
            bookCount
            email
            username
        }
    }
`;