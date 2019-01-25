require('dotenv').config();
const request = require('request-promise-native');

const argv = process.argv.slice(2);

// init slack client
const SlackWebhook = require('slack-webhook');
const { SLACK_WEBHOOK_URL } = process.env;
const slack = new SlackWebhook(SLACK_WEBHOOK_URL);

// set interval
const interval_min = !isNaN(argv[0]) ? argv[0] : 60;

slack.send(`Initializing newly filed project update task with ${interval_min} interval`);

const triggerNewFiledProjectsUpdate = () => {
  request({
    method: 'GET',
    uri: 'https://zap-api-staging.planninglabs.nyc/projects/new-filed',//'localhost:3000/new-filed',
    timeout: 5 * 60 * 1000, // 5 minutes -- this can be slow, might get slower, don't want to have to come change this
    simple: false,
    resolveWithFullResponse:true
  })
  .then((res) => {
    let jsonBody = JSON.parse(res.body);
    let slackMessage =`Updated ${jsonBody.success} newly filed project geometries successfully; ${jsonBody.failure} with failures`;
    if(res.statusCode !== 200) {
      slackMessage += `; ${jsonBody.error} with errors: ${jsonBody.errorMessages}`;
    }
    slack.send(slackMessage);

  })
  .catch((err) => {
    console.log(err);
    slack.send(`ALERT: Unable to update newly filed project geometries`);
  });

  setTimeout(triggerNewFiledProjectsUpdate, interval_min * 60 * 1000);
};

triggerNewFiledProjectsUpdate();
