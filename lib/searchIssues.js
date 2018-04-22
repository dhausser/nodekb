module.exports.search = searchIssues

const https = require('https')
const request = require('request')
const JiraApi = require('jira-client')

// Init Jira
const jira = new JiraApi({
  protocol: 'https',
  host: 'jira.atlassian.com',
  apiVersion: '2',
  strictSSL: true
})

// Search Issues
function searchIssues() {
  const options = {
    url: 'https://jira.atlassian.com/rest/api/latest/search?JQL=project=JRASERVER',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // Https Request
  return new Promise ((resolve, reject) => {
    https.get(options.url, (resp) => {
      let data = ''
      resp.on('data', (chunk) => { data += chunk })
      resp.on('end', () => {
        resolve(JSON.parse(data).issues)
      }).on("error", (err) => {
        console.log("Error: " + err.message)
        reject (err)
      })
    })
  })

  // Requests Module
  return new Promise ((resolve, reject) => {
    request.get(options, (err, resp, body) => {
      if (err) {
        reject (err)
      } else {
        resolve(JSON.parse(body).issues)
      }
    })
  })
}
