const core = require('@actions/core');
const github = require('@actions/github');
import * as Webhooks from '@octokit/webhooks'

async function Yolo() {

try {
    const myToken = core.getInput('repo-token');

    const octokit = github.getOctokit(myToken);

    console.log(`The event name: ${github.context.eventName}`);
    console.log(`The whole context: ${github.context}`);

    if (github.context.eventName === 'pull_request_review') {
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
        
        const review = github.context.payload as Webhooks.EventPayloads.WebhookPayloadPullRequestReview;

        console.log(`octokit.pulls.listReviews(
            ${review.repository.owner.login},
            ${review.repository.name},
            ${review.pull_request.number})`)

        if (review) {
            const reviews = await octokit.pulls.listReviews(
                review.repository.owner.login,
                review.repository.name,
                review.pull_request.number);

            console.log(`The reviews: ${JSON.stringify(reviews, undefined, 2)}`);
        } else {
            throw new Error("😱");

        }
    }

    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
    console.log(`The event payload: ${JSON.stringify(error, undefined, 2)}`);

}

}

Yolo();