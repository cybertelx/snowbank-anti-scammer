// Store data

import Keyv from "keyv";

const db = new Keyv(process.env.DATABASE_URL);

console.log("Connected to Keyv database");

async function write(key: string, value: string) {
  await db.set(key, value);
  return value;
}

async function read(key: string) {
  return await db.get(key);
}
export { write, read };
