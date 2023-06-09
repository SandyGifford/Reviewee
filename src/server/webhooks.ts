import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";
import express from "express";
import { WEBHOOK_TOKEN } from "./consts.server";
import { store } from "./store";

const webhooks = express();

const ghWebhooks = new Webhooks({
  secret: WEBHOOK_TOKEN,
});

ghWebhooks.on(
  "pull_request_review.submitted",
  ({
    payload: {
      review: {
        submitted_at,
        node_id,
        user: { login },
      },
    },
  }) => {
    if (!submitted_at) return;

    console.log("=>", node_id);

    const storeData = store.get();
    const newData = [...storeData];

    newData.push({
      submittedAt: submitted_at,
      id: node_id,
      login,
    });

    store.set(newData);
  }
);

webhooks.use(createNodeMiddleware(ghWebhooks));

export default webhooks;
