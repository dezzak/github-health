# GitHub Health

Personal development project to read github repositories and check things such as
- Dependabot config
- Codeowners set
- PR template set
- labels set
- admin rights

## Usage

```
nvm use
npm i
npm run build
export GITHUB_TOKEN="your github token"
npm run start
```

If you want to filter on a topic set the `FILTER_TAGS` env var, e.g. `FILTER_TAGS=psr-sausage`
