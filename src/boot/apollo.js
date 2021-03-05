import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
// import * from '../store/user'

function getHeaders () {
  const headers = {}
  const token = window.localStorage.getItem('userAuthToken')
  const refresh = window.localStorage.getItem('userRefreshToken')
  if (token && token.length && refresh && refresh !== 'undefined' && token !== 'undefined') {
    headers.authorization = `Bearer ${token}`
  }
  return headers
}

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'https://dev.grineer.info/graphql',
  request: (operation) => {
    operation.setContext({
      headers: getHeaders(),
    })
  }
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
