CREATE TABLE volumes(
    id  SERIAL PRIMARY KEY,
    usdt_in  REAL NOT NULL,
    usdt_out  REAL NOT NULL,
    btc_in  REAL NOT NULL,
    btc_out  REAL NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
