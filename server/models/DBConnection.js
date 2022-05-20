const { Client } = require("pg");

class DBConnection {
  constructor(config) {
    if (typeof DBConnection.instance === "object") return DBConnection.instance;

    this.client = new Client(config);
    DBConnection.instance = this;
  }
}

module.exports = { DBConnection };
