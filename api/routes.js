// new versions of JS to enforce secure coding practices
'use strict'

const controller = require('./controller');

module.exports = function (app) {
    app.route('/jobListPortalJob1')
        .get(controller.getJobList1);
    app.route('/jobListPortalJob2')
        .get(controller.getJobList2)
};
