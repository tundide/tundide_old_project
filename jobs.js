/**
 * Jobs for batch process
 * @namespace Jobs
 */
// TODO: Armar los jobs

let CronJob = require('cron').CronJob;

let job = new CronJob('1 * * * * *', function() {
    console.log('Enviando alertas');
}, null, true);

job.start();


let jobLockExpiredUser = new CronJob('1 * * * * *', function() {
    console.log('Se bloquearon 10 usuarios vencidos');
}, null, true);

jobLockExpiredUser.start();

let jobRemoveUnusedUsers = new CronJob('1 * * * * *', function() {
    console.log('Se eliminaron 10 usuarios sin uso');
}, null, true);

jobRemoveUnusedUsers.start();

let jobDeleteExpiredPublications = new CronJob('1 * * * * *', function() {
    console.log('Se eliminar 5 publicaciones vencidas');
}, null, true);

jobDeleteExpiredPublications.start();