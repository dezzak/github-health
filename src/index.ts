import getRepoNames from './githubApi'

getRepoNames('psr- org:JSainsburyPlc archived:false')
  .then(repos => {
    // @ts-ignore
    repos.search.nodes.forEach(repo => console.log(repo.name))
  })
  .catch(r => console.error(r))

getRepoNames('driveplan- org:JSainsburyPlc archived:false')
  .then(repos => {
    // @ts-ignore
    repos.search.nodes.forEach(repo => console.log(repo.name))
  })
  .catch(r => console.error(r))
