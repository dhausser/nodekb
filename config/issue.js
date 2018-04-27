module.exports.search = async (options) => {

  // let assignee = Array()
  // resources.map(resource => assignee.push(resource.key))
  // assignee = assignee.join()
  // options.jql += ` AND assignee in (${assignee})`

  const results = await options.jiraClient.searchJira(options.jql, {
    maxResults: 50,
    fields: [
      'creator',
      'summary',
      'issuetype',
      'progress',
      'subtasks',
      'project',
      'created',
      'updated'
    ]
   })

   const issues = results.issues
   // issues.map(issue => console.log(issue))

   return issues
   // return aggregateTime(resources, results.issues);
}

function aggregateTime(resources_array, issues) {

  const resources = resources_array.reduce((resources, item) => {
    resources[item.key] = item
    return resources
  }, {})

  issues.map(issue => {
    resources[issue.fields.assignee.key].issuesTimeOriginalEstimates.push(issue.fields.timeoriginalestimate)
    resources[issue.fields.assignee.key].issuesTimeSpent.push(issue.fields.timespent)
    resources[issue.fields.assignee.key].issuesTimeEstimates.push(issue.fields.timeestimate)
  })

  const reducer = (accumulator, currentValue) => accumulator + currentValue

  return Object.values(resources).map(resource => {
    resource.timeoriginalestimate = resource.issuesTimeOriginalEstimates.reduce(reducer)
    resource.timespent = resource.issuesTimeSpent.reduce(reducer)
    resource.timeestimate = resource.issuesTimeEstimates.reduce(reducer)
  })
}

function searchIssuesHttps(options) {

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
}

function searchIssuesRequest(options) {
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
