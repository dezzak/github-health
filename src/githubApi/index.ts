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
        repositoryTopics(first: 50) {
          nodes {
            topic {
              name
            }
          }
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

interface Topic {
  name: string
}

interface RepositoryTopicConnection {
  nodes: Array<{topic: Topic}>
}

interface RepoResponse {
  name: string
  codeowners: ObjectContents
  oldDependabot: ObjectExists
  newDependabot: ObjectExists
  prTemplate: ObjectExists
  repositoryTopics: RepositoryTopicConnection
}

interface Repo {
  name: string
  codeowners: ObjectContents
  oldDependabot: ObjectExists
  newDependabot: ObjectExists
  prTemplate: ObjectExists
  repositoryTopics: Array<Topic>
}

interface RepoNameQueryResponse {
  search: {
    nodes: Array<RepoResponse>
  }
}

const executeQuery = async (query: string): Promise<RepoNameQueryResponse> => {
  return await fetchGraphQL<RepoNameQueryResponse>(GITHUB_URL, GITHUB_REPO_NAMES_QUERY, {query}, headers)
}

const mapTopics = (topicConnection: RepositoryTopicConnection): Topic[] => {
  return topicConnection.nodes.map(topic => topic.topic)
}

const mapRepo = (repoResponse: RepoResponse): Repo => {
  const repositoryTopics = mapTopics(repoResponse.repositoryTopics)
  return {...repoResponse, repositoryTopics}
}

const getRepoDetails = async (query: string): Promise<Array<Repo>> => {
  const response = await executeQuery(query)
  return response.search.nodes.map(mapRepo);
}

export { Repo }
export default getRepoDetails
