const request = require('request');
const redis = require('redis')
const fetch = require('node-fetch')

const api_url = "https://api.ekkoapp.app/api/external-services/semco/jobs/v1"
//create and connect redis client to local instance
const client = redis.createClient(6379)

const jobList2 = {
    get(req, res) {
        // key to store results in Redis store
        const jobList2RedisKey = 'user:jobs2'

        return client.get(jobList2RedisKey, (err, jobs) => {

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
                                    jobId: job.id,
                                    jobTitle: job.title_en,
                                    startDate: job.startDate,
                                    endDate: job.endDate
                                    //functionalArea: job && job.data ? job.data.title.localization[2] : null
                                }

                                sortedValue = filteredResults;
                            }
                            jobContent.push(sortedValue)
                            console.log(jobContent)
                        })

                        // Save the  API response in Redis store,  data expire time in 18000 seconds, it means 30 mins
                        client.setex(jobList2RedisKey, 10, JSON.stringify(jobContent))


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


module.exports = jobList2;
