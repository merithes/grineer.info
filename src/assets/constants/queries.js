import gql from 'graphql-tag'

export const LOGIN = gql`
mutation LoginUser ($username: String!, $password: String!) {
  login( input: {
    identifier: $username,
    password: $password
  } ) {
    jwt
    user {
      id
      username
    }
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

export const GET_COMMENTS = gql`
query getComments ($articleId: ID){
  comments(where: {news_article: $articleId}){
    id
    created_at
    updated_at
    content
    author { id username}
  }
}`
