/**
 * Jobs for batch process
 * @namespace Jobs
 */

let CronJob = require('cron').CronJob;

let job = new CronJob('1 * * * * *', function() {
    console.log('SE EJECUTA EL ENVIO DE MAIL DE ALERTAS');
}, null, true);

job.start();


let jobLockExpiredUser = new CronJob('1 * * * * *', function() {
    console.log('Se bloquearon 10 usuarios vencidos');
}, null, true);

jobLockExpiredUser.start();