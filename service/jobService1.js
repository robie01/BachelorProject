const request = require('request');
const redis = require('redis')
const fetch = require('node-fetch')

const api_url = "https://api.emply.com/v1/semcomaritime-v2/postings"
//create and connect redis client to local instance
const client = redis.createClient(6379)

const jobList1 = {
    get(req, res) {
        // key to store results in Redis store
        const jobList1RedisKey = 'user:jobs1'

        return client.get(jobList1RedisKey, (err, jobs) => {
            if (jobs) {
                return res.json({source: 'cache', fields: JSON.parse(jobs)})
            } else { // key does not exist in Redis store
                fetch(api_url)
                    .then(response => response.json())
                    .then(jobs => {
                        // to do fetch the desired output
                        let jobContent = [];
                        let sortedValue;
                        jobs.forEach(function (job) {
                            for (let i = 0; i < jobs.length; i++) {
                                let filteredResults = {
                                    jobId: job.jobId,
                                    jobTitle: job.title.localization[2],
                                    location: job.location.address,
                                    created: job.created,
                                    edited: job.edited,
                                    deadline: job.deadline,
                                    deadlineText: job.deadlineText.localization[1],
                                    //functionalArea: job && job.data ? job.data.title.localization[2] : null
                                }

                                sortedValue = filteredResults;
                            }
                            jobContent.push(sortedValue)
                            console.log(jobContent)
                        })

                        // Save the  API response in Redis store,  data expire time in 18000 seconds, it means 30 mins
                        client.setex(jobList1RedisKey, 10, JSON.stringify(jobContent))


                        //let dataVal = getNestedObject(jobs, ['data'[ 'title', 'localization'[ 2, 'locale']]])


                        console.log("result", jobContent)
                        // Send JSON response to client
                        return res.json({source: 'api', fields: jobContent})


                    })
                    .catch(error => {
                        console.log(error)
                        // send error to the client
                        return res.json(error.toString())
                    })
            }
        })
    }
}

module.exports = jobList1;
