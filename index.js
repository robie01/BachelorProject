const app = require('./service/jobService1')
const app3 = require('./service/jobService_temp')
const config1 = require('./domain/configDomain1')
const config2 = require('./domain/configDomain2')


app.listen(config1.port, ()=>{
    console.log('API REST running in http://localhost:${config1.port}')
})
app3.listen(config2.port, ()=>{
    console.log('API REST running in http://localhost:${config2.port}')
})



// what use: domain, service and index.js
