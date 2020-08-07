import { gql } from 'graphql-request/dist'
import fetchGraphQL from './utils/fetchGraphQL'

const githubToken = process.env.GITHUB_TOKEN
const GITHUB_URL = 'https://api.github.com/graphql'
const GITHUB_QUERY = gql`
query {
  viewer {
    login
  }
}
`
const headers = {
  Authorization: `bearer ${githubToken}`
}

const getData = async () => {
  return await fetchGraphQL(GITHUB_URL, GITHUB_QUERY, {}, headers)
}

getData().then(r => console.debug(r)).catch(r => console.error(r))
