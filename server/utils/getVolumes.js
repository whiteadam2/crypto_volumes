const axios = require("axios").default;
const config = require("config");
const apiConfig = config.get("api");
const appConfig = config.get("app");

async function getVolumes() {
  const url = `https://api.whale-alert.io/v1/transactions?api_key=${apiConfig.api_key}&min_value=${apiConfig.min_amount}`;
  let response = await axios.get(url);
  let transactions = response.data.transactions;

  console.log("First request: " + transactions.length);
  console.log(response.data.result);
  let count = 1;

  while (response.data.result !== "error" && response.data.count === 100) {
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), appConfig.timeout);
    });

    response = await axios.get(url + "&cursor=" + response.data.cursor);
    transactions = [...transactions, ...response.data.transactions];

    count++;

    console.log(`Request number ${count}: ${transactions.length}`);
    console.log(response.data.result);
  }

  const volumes = transactions.reduce(
    (memo, transaction) => {
      if (transaction.symbol === "usdt") {
        if (
          transaction.from.owner_type === "exchange" &&
          transaction.to.owner_type === "unknown"
        )
          memo.usdt.out += transaction.amount_usd;
        if (
          transaction.from.owner_type === "unknown" &&
          transaction.to.owner_type === "exchange"
        )
          memo.usdt.in += transaction.amount_usd;
      }

      if (transaction.symbol === "btc") {
        if (
          transaction.from.owner_type === "exchange" &&
          transaction.to.owner_type === "unknown"
        )
          memo.btc.out += transaction.amount_usd;
        if (
          transaction.from.owner_type === "unknown" &&
          transaction.to.owner_type === "exchange"
        )
          memo.btc.in += transaction.amount_usd;
      }

      return memo;
    },
    { btc: { in: 0, out: 0 }, usdt: { in: 0, out: 0 } }
  );

  console.log(volumes);

  return volumes;
}

module.exports = {
  getVolumes,
};
