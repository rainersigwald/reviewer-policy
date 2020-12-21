const core = require('@actions/core');
const github = require('@actions/github');
import * as Webhooks from '@octokit/webhooks'

try {
    const myToken = core.getInput('repo-token');

    const octokit = github.getOctokit(myToken)

    if (github.context.eventName === 'pull_request_review') {
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
        
        const review = github.context.payload as Webhooks.EventPayloads.WebhookPayloadPullRequestReview;

        if (review) {
            const reviews = octokit.pulls.listReviews(
                review.repository.owner,
                review.repository.name,
                review.pull_request.number);

            reviews.forEach(r => {
                const payload = JSON.stringify(r, undefined, 2)
                console.log(`The event payload: ${payload}`);
            });
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
}
