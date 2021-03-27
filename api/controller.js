const properties = require('../package.json')
const jobList1 = require('../service/jobService1')
const jobList2 = require('../service/jobService2')

const controllers = {
    getJobList1: function (req, res)
    {
        jobList1.get(req, res, function (err, jobs){
            if(err)
                res.send(err);
            res.json(jobs)
        })
    },
    getJobList2: function (req, res)
    {
        jobList2.get(req, res, function (err, jobs){
            if(err)
                res.send(err);
            res.json(jobs)
        })
    },
}

module.exports = controllers;
