import * as MongoDB from "mongodb"

import {
  collections,
  connectToDatabase,
  QuickenImport,
  setupCollections,
  useCollection,
  useDatabase,
} from "./database.service.js"

test("Service connects with database, returning handler", async () => {
  const dbConn = await connectToDatabase()

  expect(dbConn).toBeInstanceOf(MongoDB.MongoClient)
})

test("Service configures to specific database", async () => {
  const client = (await connectToDatabase()) as MongoDB.MongoClient

  expect(await useDatabase(client)("testy")).toHaveProperty(
    "namespace",
    "testy",
  )
})

test("Set up two collections", async () => {
  const client = (await connectToDatabase()) as MongoDB.MongoClient
  const db = useDatabase(client)("test")
  const quickenModel = useCollection(db)<QuickenImport>("quicken")
  const accountsModel = useCollection(db)("accounts")

  setupCollections({ quickenModel, accountsModel })

  const portfolio = useCollection(db)("portfolio")

  setupCollections({ portfolio })

  expect(collections).toHaveProperty("quicken")
  expect(collections).toHaveProperty("accounts")
})

// test("addImport returns the timestamp of the import if successful", async () => {
//   // await connectToDatabase()
//   const resource = {
//     createdTimestamp: new Date(),
//     data: ["data1", "data2"],
//   }

//   const spy = jest.spyOn(collections.quicken, "insertOne")

//   const result = await addImport(resource)
//   expect(spy).toHaveBeenCalledTimes(1)
//   expect(result.val).toBeInstanceOf(Date)
// })
