const JiraApi = require('jira-client')

const jira = new JiraApi({
  protocol: 'https',
  host: 'jira.atlassian.com',
  apiVersion: '2',
  strictSSL: true
})

const query = 'project=JRASERVER'

const search = async (query) => {
  const res = await jira.searchJira(query, {
    startAt: '0',
    maxResults: '5'
  })
}

module.exports = search()
