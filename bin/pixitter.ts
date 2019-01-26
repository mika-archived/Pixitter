#!/usr/bin/env node
import * as cdk from "@aws-cdk/cdk";
import { PixitterStack } from "../lib/pixitter-stack";

const app = new cdk.App();
new PixitterStack(app, `PixitterStack`);
app.run();
