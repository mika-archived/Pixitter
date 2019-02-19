import { CloudWatchLogsEvent, Context, Callback } from "aws-lambda";
import dayjs from "dayjs";
import Pixela from "pixela-node";
import Twitter from "twitter";

// pixela-node で型付きで返して欲しい...
type Type = "int" | "float";
type Color = "shibafu" | "momiji" | "sora" | "ichou" | "ajisai" | "kuro";

interface Graph {
  id: string;
  name: string;
  unit: string;
  type: Type;
  color: Color;
  timezone: string;
  purgeCacheURLs: string[];
}

async function getStatuses(options: Twitter.AccessTokenOptions): Promise<Twitter.ResponseData> {
  const twtr = new Twitter(options);

  return new Promise((resolve, reject) => {
    twtr.get("account/verify_credentials", (error, data) => {
      if (error) {
        reject();
      } else {
        const screen_name = data.screen_name;
        twtr.get("statuses/user_timeline", { screen_name, count: 200, trim_user: true, include_rts: false }, (error, data) => {
          if (error) {
            reject();
          } else {
            resolve(data);
          }
        });
      }
    });
  });
}

export const handler = async (_event: CloudWatchLogsEvent, _context: Context, callback: Callback) => {
  const tokens = [
    process.env.TWITTER_ACCESS_TOKENS.split(","),
    process.env.TWITTER_ACCESS_TOKEN_SECRETS.split(","),
  ];

  let [tweets, retweets] = [0, 0];
  const regex = /([0-9]+-[0-9]+)のポスト数：([0-9]+) \(うちRT：([0-9]+)\)/m;
  for (let i = 0; i < tokens[0].length; i++) {
    try {
      const statuses: any[] = <any[]>await getStatuses({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: tokens[0][i].trim(),
        access_token_secret: tokens[1][i].trim()
      });


      for (const status of statuses) {
        if (/ツイ廃あらーと/.test(status.source)) {
          const match = (status.text as string).match(regex);
          if (!match) {
            continue;
          }

          const [_, date, posts, rts] = match;
          if (date === dayjs().format("MM-DD")) {
            tweets += parseInt(posts);
            retweets += parseInt(rts);
            break;
          }
        }
      }
    } catch (err) {
      continue;
    }
  }

  const client = new Pixela();
  client.username = process.env.PIXELA_USERNAME;
  client.token = process.env.PIXELA_ACCESS_TOKEN;

  const graphs = await client.getGraphs().then(w => w.data.graphs as Graph[]);
  if (graphs.filter(w => w.id === "twitter").length == 0) {
    await client.createGraph({
      id: "twitter",
      color: "sora",
      name: "Twitter",
      type: "int",
      unit: "pots(s)",
      timezone: "Asia/Tokyo"
    } as any);
  }

  await client.createPixel("twitter", {
    date: dayjs().format("YYYYMMDD"),
    quantity: `${tweets}`,
    optionalData: JSON.stringify({
      retweets,
    })
  } as any)
};
