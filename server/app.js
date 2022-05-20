require("dotenv").config();

const express = require("express");
const app = express();
var cors = require("cors");

const config = require("config");
const dbConfig = config.get("db");
const appConfig = config.get("app");

const CronJob = require("cron").CronJob;

const { MarketVolume } = require("./models/MarketVolume");
const { getVolumes } = require("./utils/getVolumes");

const market = new MarketVolume({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.name,
  user: dbConfig.user,
  password: dbConfig.pass,
});

(async function () {
  await market.init();
})();

app.use(cors());

app.get("/", async function (req, res) {
  const data = await market.read();
  res.send(data);
});

app.listen(appConfig.express_port, () =>
  console.log(`Listenning port ${appConfig.express_port}...`)
);

async function run() {
  const { usdt, btc } = await getVolumes();
  await market.save({ usdt, btc });
}

let job = new CronJob(
  appConfig.schedule,
  run,
  null,
  true,
  "America/Los_Angeles"
);
job.start();
