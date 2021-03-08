import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from "apollo-cache-inmemory";
import { getMainDefinition } from "apollo-utilities";
import fetch from "node-fetch";


export function apolloClientBeforeCreate ({ apolloClientConfigObj, store /* apolloClientConfigObj, app, router, ssrContext, urlPath, redirect */ }) {
  const httpLink = createHttpLink({
    uri: 'https://strapi.grineer.info/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: store.state.session.jwt ? `Bearer ${store.state.session.jwt}` : "",
      }
    }
  });
  apolloClientConfigObj.link = authLink.concat(httpLink)
  apolloClientConfigObj.cache = new InMemoryCache()
}

export function apolloClientAfterCreate (/* { apolloClient, app, router, store, ssrContext, urlPath, redirect } */) {
  // if needed you can modify here the created apollo client
}
