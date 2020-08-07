import { gql } from 'graphql-request/dist'
import fetchGraphQL from '../utils/fetchGraphQL'

const githubToken = process.env.GITHUB_TOKEN
const GITHUB_URL = 'https://api.github.com/graphql'
const GITHUB_REPO_NAMES_QUERY = gql`
query ($query: String!) {
  search(query: $query, type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        name
      }
    }
  }
}
`
const headers = {
  Authorization: `bearer ${githubToken}`
}

interface RepoNameQueryResponse {
  search: {
    nodes: Array<{
      name: String
    }>
  }
}

const getRepoNames = async (query: String) => {
  return await fetchGraphQL<RepoNameQueryResponse>(GITHUB_URL, GITHUB_REPO_NAMES_QUERY, {query}, headers)
}

export default getRepoNames
