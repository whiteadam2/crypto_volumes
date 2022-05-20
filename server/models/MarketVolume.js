const config = require("config");
const appConfig = config.get("app");
const { DBConnection } = require("./DBConnection");

class MarketVolume {
  constructor(dbConfig) {
    this.repository = new DBConnection(dbConfig);
  }

  async init() {
    await this.repository.client.connect();
  }

  async save({ btc, usdt }) {
    const sql =
      "INSERT INTO volumes(btc_in, btc_out, usdt_in, usdt_out) VALUES($1, $2, $3, $4) RETURNING *";
    const props = [btc.in, btc.out, usdt.in, usdt.out];

    try {
      const result = await this.repository.client.query(sql, props);
      return result.rows[0];
    } catch (err) {
      console.log(err.stack);
    }
  }

  async read() {
    const sql = `select * from (select * from volumes order by created_at desc limit ${appConfig.num_records}) subquery order by id asc`;

    try {
      const result = await this.repository.client.query(sql);
      return result.rows;
    } catch (err) {
      console.log(err.stack);
    }
  }
}

module.exports = { MarketVolume };
