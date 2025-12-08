import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/DoAn2'
const options = {}

if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri, options)
  globalThis._mongoClientPromise = client.connect()
}

export async function getMongoClient() {
  return globalThis._mongoClientPromise
}

export async function getDb(dbName) {
  const client = await getMongoClient()
  const name = dbName || process.env.MONGODB_DB || 'DoAn2'
  return client.db(name)
}
