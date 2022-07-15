import * as dotenv from "dotenv"
import * as MongoDB from "mongodb"
import {
  Ok,
  Result,
} from "ts-results-es"

export interface QuickenImport {
  id?: MongoDB.ObjectId
  createdTimestamp: Date
  data: string[]
}

type ServiceCollections = Record<string, MongoDB.Collection>

export function connectToDatabase() {
  try {
    dotenv.config()
    const uri = process.env.MIGW_DB_URI
    const mongoClientOptions: MongoDB.MongoClientOptions = {
      maxPoolSize: 50,
      w: "majority",
      wtimeoutMS: 2500,
    }
    if (!uri) return new Error("Cannot start server")
    return MongoDB.MongoClient.connect(uri, mongoClientOptions)
      .then((client) => client)
      .catch((error) => {
        throw new Error(error)
      })
  } catch (error) {
    console.error(error)
  }
}

export const useDatabase = (client: MongoDB.MongoClient) => (dbName: string) =>
  client.db(dbName)

export const useCollection = (db: MongoDB.Db) => <T extends MongoDB.Document>(collection: string) =>
  db.collection<T>(collection)

export const collections: ServiceCollections = {}

export const setupCollections = (newCollections: ServiceCollections) => {
  Object.assign(collections, newCollections)
}

// export const collections = {
//   quicken: (db: MongoDB.Db) => async (collection) => db.collection(collection),
// }

// export const collections: { quicken: MongoDB.Collection<QuickenImport> } =
//   Object.assign((await connectToDatabase()).collection("quicken"))

export async function addImport(
  resource: QuickenImport,
): Promise<Result<Date, Error>> {
  console.log(resource)
  return Ok(new Date())
}
