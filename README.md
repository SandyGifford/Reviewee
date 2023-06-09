# Reviewee

## Environment variables

(`.env` supported)

|             key | description                                                       | required |
| --------------: | :---------------------------------------------------------------- | :------: |
|    `AUTH_TOKEN` | GitHub Personal Access token                                      |    ☑️    |
|           `ORG` | The org that the repo is in                                       |    ☑️    |
|          `REPO` | The repo to scan                                                  |    ☑️    |
|          `PORT` | The port to run the server on                                     |          |
| `WEBHOOK_TOKEN` | Secret token for the webhook (if not provided webhooks won't run) |          |
