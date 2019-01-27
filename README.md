# Pixitter

Lambda Function that plots the number of post in Twitter per day to Pixela.

![](https://pixe.la/v1/users/mika/graphs/twitter)


## Stacks

* AWS CloudWatch Events
* AWS Lambda
* [ツイ廃あらーと](https://twihaialert.net/)


## Environment Varibles

| Variable                       | Description                                       | Example                               |
| ------------------------------ | ------------------------------------------------- | ------------------------------------- |
| `PIXELA_USERNAME`              | Pixela's Username                                 | `mika`                                |
| `PIXELA_ACCESS_TOKEN`          | Pixela's Access Token                             | `YOUR_ACCESS_TOKEN`                   |
| `TWITTER_CONSUMER_KEY`         | Twitter Application Consumer Key                  | `YOUR_CONSUMER_KEY`                   |
| `TWITTER_CONSUMER_SECRET`      | Twitter Application Consumer Secret               | `YOUR_CONSUMER_SECRET`                |
| `TWITTER_ACCESS_TOKENS`        | Access Token that account to be summarized        | `["ACCESS_TOKEN_A", "B", ...]`        |
| `TWITTER_ACCESS_TOKEN_SECRETS` | Access Token Secret that account to be summarized | `["ACCESS_TOKEN_SECRET_A", "B", ...]` |


## Useful commands

* `npm run build:cdk`   compile typescript to js
* `npm run watch:cdk`   watch for changes and compile
* `cdk deploy`          deploy this stack to your default AWS account/region
* `cdk diff`            compare deployed stack with current state
* `cdk synth`           emits the synthesized CloudFormation template
