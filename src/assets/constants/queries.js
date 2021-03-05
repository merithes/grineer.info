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
mutation SubmitComment ($articleId: ID!, $content: String!) {
  createComment(
    input: {
      data : {
        content: $content
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
