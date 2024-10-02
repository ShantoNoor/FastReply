import { Client, Databases, ID } from "appwrite";
import browser from "webextension-polyfill";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject(projectId);

const db = new Databases(client);

export async function fetchAndSet() {
  const res = await db.listDocuments(databaseId, collectionId, []);

  const replies = res.documents ?? [];

  try {
    await browser.storage.local.set({ replies });
  } catch (err) {
    console.error(err);
  }

  return replies;
}

export async function addReply(document) {
  try {
    const result = await db.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      document
    );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
