import gql from 'graphql-tag'

export const LOGIN = gql`
mutation LoginUser ($username: String!, $password: String!) {
  login( input: {
    identifier: $username,
    password: $password
  } ) {
    jwt
    user { id username }
  }
}`

export const REGISTER = gql`
mutation RegisterUser ($username: String!, $email: String!, $password: String!) {
  register( input: {
    username: $username,
    email: $email,
    password: $password
  } ) {
    user { id username }
    jwt
  }
}`

export const COMMENT_SUBMIT = gql`
mutation SubmitComment ($articleId: ID, $commentInput: String!) {
  createComment(
    input: {
      data : {
        content: $commentInput
        news_article: $articleId
  		}
    }
  ){
    comment {
      id
      content
    }
  }
}`

export const UPDATE_COMMENT = gql`
mutation UpdateComment ($commentId: ID!, $commentInput: String!) {
  updateComment (input: { where: { id: $commentId}, data: { content: $commentInput } }){
   comment { id }
 }
}`

export const GET_COMMENTS = gql`
query GetComments ($articleId: ID){
  comments(where: {news_article: $articleId}, sort: "created_at:desc"){
    id
    created_at
    updated_at
    content
    author { id username}
  }
}`



export const GET_USER = gql`
query GetUser ($userId: ID!){
  user(id: $userId){
    id
    created_at
    username
    email
    blocked
    description
    displayName
    comments (sort: "created_at:desc", limit: 3) {
      id
      content
      created_at
      updated_at
      news_article {
        id
        slug
        title
      }
    }
  }
}`
