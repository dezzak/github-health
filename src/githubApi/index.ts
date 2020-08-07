import { gql } from 'graphql-request/dist'
import fetchGraphQL from '../utils/fetchGraphQL'

//{"query":"psr- org:JSainsburyPlc archived:false"}
//https://raw.githubusercontent.com/JSainsburyPLC/psr-bookmaker/master/.github/CODEOWNERS?token=AAZNELFDY6AIURVFCJOY26C7G2DLO
const githubToken = process.env.GITHUB_TOKEN
const GITHUB_URL = 'https://api.github.com/graphql'
const GITHUB_REPO_NAMES_QUERY = gql`
query ($query: String!) {
  search(query: $query, type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        name
        codeowners: object(expression: "master:.github/CODEOWNERS") {
          ... on Blob {
            text
          }
        }
        oldDependabot: object(expression: "master:.dependabot/config.yml") {
          abbreviatedOid
        }
        newDependabot: object(expression: "master:.github/dependabot.yml") {
          abbreviatedOid
        }
        prTemplate: object(expression: "master:.github/PULL_REQUEST_TEMPLATE.md") {
          abbreviatedOid
        }
      }
    }
  }
}
`
const headers = {
  Authorization: `bearer ${githubToken}`
}

interface ObjectContents {
  text: string
}

interface ObjectExists {
  abbreviatedOid: string
}

interface Repo {
  name: string
  codeowners: ObjectContents
  oldDependabot: ObjectExists
  newDependabot: ObjectExists
  prTemplate: ObjectExists
}

interface RepoNameQueryResponse {
  search: {
    nodes: Array<Repo>
  }
}

const getRepoNames = async (query: string) => {
  return await fetchGraphQL<RepoNameQueryResponse>(GITHUB_URL, GITHUB_REPO_NAMES_QUERY, {query}, headers)
}

export { Repo }
export default getRepoNames
