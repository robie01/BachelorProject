
const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')

// create express application instance
const app = express()

//create and connect redis client to local instance
const client = redis.createClient(6379)
const api_url = "https://api.emply.com/v1/semcomaritime-v2/postings"

client.on('error', (err) => {
    console.log("Error " + err)
});
let jobList;
app.get('/jobs',(req, res) => {

    let titleValue = [];

    // key to store results in Redis store
    const jobListRedisKey = 'user:jobs'

    return client.get(jobListRedisKey, (err, jobs) => {

        if(jobs){
            return res.json({source: 'cache', data: JSON.parse(jobs)})
        } else { // key does not exist in Redis store
            fetch(api_url)
                .then(response => response.json())
                .then(jobs => {
                    // to do fetch the desired output
                    let jobContent = [];
                    let sortedValue;

                    jobs.forEach(function(job){
                        for (let i = 0; i < jobs.length; i++) {
                            let filteredResults = {
                                jobId: job.jobId,
                                title: job.title.localization[2],

                                location:job.location.address,
                                created: job.created,
                                edited: job.edited,
                                deadline: job.deadline,
                                deadlineText : job.deadlineText.localization[1],
                            }
                            sortedValue = filteredResults;
                        }
                        jobContent.push(sortedValue)
                        console.log(jobContent)
                    })

                    // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
                    client.setex(jobListRedisKey, 10, JSON.stringify(jobContent))

                    let filteredResults = {

                        title: jobs.map(job => job.title),
                        location: jobs.map(job => job.location.address),
                        //functionalArea:jobs.map(job => job.localization[0]),
                        created: jobs.map(job => job.created),
                        edited: jobs.map(job => job.edited),
                        deadline: jobs.map(job => job.deadline),
                        deadlineText: jobs.map(job => job.deadlineText)
                       // fields: jobs.map(obj => mapOut(obj, ["applyUrl", "timeZone", "adUrl", "mediaId", "advertisements", "type", "created", "edited", "tags", "data", "deadlineUTC"]))
                    }
                    console.log("result", jobContent)
                    // Send JSON response to client
                    return res.json({ source: 'api', data: filteredResults
                    })

                })
                .catch(error => {
                    console.log(error)
                    // send error to the client
                    return res.json(error.toString())
                })
        }
    })
})

function mapOut(sourceObject, removeKeys = []) {
    const sourceKeys = Object.keys(sourceObject);
    const returnKeys = sourceKeys.filter(k => !removeKeys.includes(k));
    let returnObject = {};
    returnKeys.forEach(k => {
        returnObject[k] = sourceObject[k];
    });
    return returnObject;
}

// start express server at 3000 port
app.listen(4000, () => {
    console.log('Server listening on port: ', 4000)
});
