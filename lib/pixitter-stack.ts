#!/usr/bin/env node
import * as cdk from "@aws-cdk/cdk";
import * as events from "@aws-cdk/aws-events";
import * as lambda from "@aws-cdk/aws-lambda";

export class PixitterStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const event = new events.EventRule(this, `PixitterEvent`, {
      ruleName: "pixitter-cron-scheduled-event",
      description: "Pixitter Cron Scheduled Event for Lambda",
      scheduleExpression: "cron(10 15 * * ? *)", // run on 00:10:00 JST
    });

    const task = new lambda.Function(this, `PixitterTask`, {
      code: lambda.Code.asset("./dist"),
      handler: "index.handler",
      memorySize: 256,
      timeout: 30,
      runtime: lambda.Runtime.NodeJS810,
      environment: {
        PIXELA_USERNAME: process.env.PIXELA_USERNAME,
        PIXELA_ACCESS_TOKEN: process.env.PIXELA_ACCESS_TOKEN,
        TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
        TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
        TWITTER_ACCESS_TOKENS: process.env.TWITTER_ACCESS_TOKENS, // JSON String Array ["AccessTokenA", "~B", ...]
        TWITTER_ACCESS_TOKEN_SECRETS: process.env.TWITTER_ACCESS_TOKEN_SECRETS // JSON String Array ["AccessTokenSecretA", "~B", ...]
      }
    });

    event.addTarget(task);
  }
}
