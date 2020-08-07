import getRepoDetails, { Repo } from './githubApi'

const FLAG_SHOW_GOOD_DETAIL = false
const FLAG_CHECK_DEPENDABOT = false
const FLAG_CHECK_CODEOWNERS = false
const FLAG_CHECK_PR_TEMPLATE = false
const FLAG_CHECK_TOPICS = true
const FLAG_CHECK_ADMIN = true

interface CheckResults {
  errors: string[],
  warnings: string[],
  good: string[]
}

const checkPRTemplate = (repo: Repo): CheckResults => {
  const results: CheckResults = {errors: [], warnings: [], good: []}
  if (repo.prTemplate) {
    results.good.push('PR Template found')
  } else {
    results.errors.push('No PR Template found')
  }
  return results
}

const checkDependabot = (repo: Repo): CheckResults => {
  const results: CheckResults = {errors: [], warnings: [], good: []}
  if (/\-infra$/.test(repo.name)) {
    // Skip for infra repos
    return results
  }
  if (repo.newDependabot) {
    results.good.push('V2 Dependabot config found')
  } else if (repo.oldDependabot) {
    results.warnings.push('V1 Dependabot config found - consider upgrading')
  } else {
    results.errors.push('No Dependabot config found')
  }
  return results
}

const checkCodeowners = (repo: Repo): CheckResults => {
  const results: CheckResults = {errors: [], warnings: [], good: []}
  if (repo.codeowners) {
    if(repo.codeowners.text.search(/^\* @JSainsburyPLC\/DrivePlan/m) >= 0) {
      results.good.push('Codeowners configured correctly')
    } else {
      results.errors.push('Codeowners not configured correctly')
    }
  } else {
    results.errors.push('No codeowners config found')
  }
  return results
}

const checkTopics = (repo: Repo) => {
  const results: CheckResults = {errors: [], warnings: [], good: []}

  const requiredTopics = ['plan-schedule-route', 'manchester']
  const requireAtLeastOneOf = ['psr-sausage', 'psr-tomato']

  requiredTopics.forEach((topic) => {
    if (repo.repositoryTopics.includes(topic)) {
      results.good.push(`Required topic ${topic} found`)
    } else {
      results.errors.push(`Required topic ${topic} not found`)
    }
  })

  if (requireAtLeastOneOf.some(topic => repo.repositoryTopics.indexOf(topic) >= 0)) {
    results.good.push(`Found one of topics: ${requireAtLeastOneOf.join(', ')}`)
  } else {
    results.errors.push(`One or more of the following topics should be present: ${requireAtLeastOneOf.join(', ')}`)
  }

  return results
}

const checkAdmin = (repo: Repo): CheckResults => {
  const results: CheckResults = {errors: [], warnings: [], good: []}
  if (repo.viewerCanAdminister) {
    results.good.push('Admin rights set')
  } else {
    results.errors.push('No admin rights')
  }
  return results
}
const scanRepo = (repo: Repo) => {
  if (/^drm-/.test(repo.name)) {
    // skip if DriveTime
    return
  }

  if (/^DS033-/.test(repo.name)) {
    // skip if DACE
    return
  }

  const repoErrors: string[] = []
  const repoGood: string[] = []
  const repoWarning: string[] = []

  if (FLAG_CHECK_ADMIN) {
    const adminResults = checkAdmin(repo)
    adminResults.errors.forEach(v => repoErrors.push(v))
    adminResults.good.forEach(v => repoGood.push(v))
    adminResults.warnings.forEach(v => repoWarning.push(v))
  }

  if (FLAG_CHECK_PR_TEMPLATE) {
    const prResults = checkPRTemplate(repo)
    prResults.errors.forEach(v => repoErrors.push(v))
    prResults.good.forEach(v => repoGood.push(v))
    prResults.warnings.forEach(v => repoWarning.push(v))
  }

  if (FLAG_CHECK_DEPENDABOT) {
    const dependabotResults = checkDependabot(repo)
    dependabotResults.errors.forEach(v => repoErrors.push(v))
    dependabotResults.good.forEach(v => repoGood.push(v))
    dependabotResults.warnings.forEach(v => repoWarning.push(v))
  }

  if (FLAG_CHECK_CODEOWNERS) {
    const codeownersResults = checkCodeowners(repo)
    codeownersResults.errors.forEach(v => repoErrors.push(v))
    codeownersResults.good.forEach(v => repoGood.push(v))
    codeownersResults.warnings.forEach(v => repoWarning.push(v))
  }

  if (FLAG_CHECK_TOPICS) {
    const topicsResults = checkTopics(repo)
    topicsResults.errors.forEach(v => repoErrors.push(v))
    topicsResults.good.forEach(v => repoGood.push(v))
    topicsResults.warnings.forEach(v => repoWarning.push(v))
  }

  if (repoErrors.length == 0) {
    if (repoWarning.length == 0) {
      console.info(`✅ ${repo.name}`)
    } else {
      console.warn(`❕️ ${repo.name}`)
    }
  } else {
    console.warn(`❌️ ${repo.name}`)
  }
  repoErrors.length > 0 && console.warn(repoErrors)
  repoWarning.length > 0 && console.warn(repoWarning)
  repoGood.length > 0 && FLAG_SHOW_GOOD_DETAIL && console.info(repoGood)
}

getRepoDetails('psr- org:JSainsburyPlc archived:false')
  .then(repos => {
    repos.forEach(scanRepo)
  })
  .catch(r => console.error(r))

getRepoDetails('driveplan- org:JSainsburyPlc archived:false')
  .then(repos => {
    repos.forEach(scanRepo)
  })
  .catch(r => console.error(r))
