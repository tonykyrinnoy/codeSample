import { ApolloClient, InMemoryCache } from '@apollo/client'

const uri = process.env.SHOPIFY_STORE_DOMAIN
const token = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN!

const client = new ApolloClient({
  uri: `${uri}/api/2021-07/graphql.json`,
  cache: new InMemoryCache(),
  headers: {
    'X-Shopify-Storefront-Access-Token': token,
  },
})

export default client
