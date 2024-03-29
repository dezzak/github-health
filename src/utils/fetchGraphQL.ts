import 'cross-fetch/polyfill'
import { GraphQLClient, Variables } from 'graphql-request'

const fetchGraphQL = async <T>(
  url: string,
  query: string,
  variables?: Variables,
  headers?: Record<string, string>
): Promise<T> => {
  const gql = new GraphQLClient(url, { headers })

  try {
    return await gql.request(query, variables)
  } catch (e: any) {
    const { errors, status } = e?.response || { errors: false, status: -69 }

    if (errors) {
      throw new Error(`GraphQL Error: ${errors[0]?.message}`)
    }
    if (status !== 200) {
      throw new Error(`Could not retrieve data from ${url} - status was ${status}`)
    }

    throw e
  }
}

export default fetchGraphQL
