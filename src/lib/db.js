import { Client, Databases, ID, Query } from "appwrite";
import browser from "webextension-polyfill";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject(projectId);

const db = new Databases(client);

export async function fetchAndSet() {
  const allReplies = [];

  for (let i = 0; ; i++) {
    const res = await db.listDocuments(databaseId, collectionId, [
      Query.limit(25),
      Query.offset(25 * i),
    ]);
    const replies = res.documents ?? [];
    allReplies.push(...replies);

    if (replies.length === 25) {
      continue;
    }
    break;
  }

  try {
    await browser.storage.local.set({ replies: allReplies });
  } catch (err) {
    console.error(err);
  }

  return allReplies;
}

export async function addReply(document) {
  try {
    return await db.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      document
    );
  } catch (err) {
    console.error(err);
  }
}

export async function deleteReply(documentId) {
  try {
    return await db.deleteDocument(databaseId, collectionId, documentId);
  } catch (err) {
    console.error(err);
  }
}

export async function updateReply(documentId, updatedDocument) {
  try {
    return await db.updateDocument(
      databaseId,
      collectionId,
      documentId,
      updatedDocument
    );
  } catch (err) {
    console.error(err);
  }
}
