import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  collectionGroup
} from "firebase/firestore";
import { User, Category, Video } from "../types";
import { INITIAL_CATEGORIES, INITIAL_VIDEOS, INITIAL_USERS } from "./mockDb";

import firebaseConfig from "../../firebase-applet-config.json";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specified database ID from the console config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Seeds the firestore database with default collections if they do not exist.
 * This runs on app startup to guarantee first-time launch is populated with all
 * categories, initial users, and workout videos.
 */
export async function seedFirestoreIfNeeded() {
  const seedVersion = "v6_sync_all_videos";
  const seededKey = `fitrep_firestore_seeded_${seedVersion}`;
  
  if (localStorage.getItem(seededKey) === "true") {
    console.log("Database already seeded with default categories and videos.");
    return;
  }

  try {
    // 1. Sync and update categories directly (ensures correct names and structure)
    console.log("Syncing default categories to Firestore...");
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, "categories", cat.id), cat);
    }

    // 2. Sync and update default videos (overwrites to ensure latest URLs and categories)
    console.log("Syncing default videos to Firestore...");
    for (const vid of INITIAL_VIDEOS) {
      await setDoc(doc(db, "videos", vid.id), vid);
    }

    // 3. Seed initial users if empty
    console.log("Checking and seeding initial users...");
    const userSnap = await getDocs(collection(db, "users"));
    if (userSnap.empty) {
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, "users", u.id), u);
      }
    }

    localStorage.setItem(seededKey, "true");
    console.log("Firestore default categories, videos, and users successfully synced!");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "seed_collections");
  }
}

// Helper methods to write directly to Firestore collections

export function cleanUndefined(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  }
  const clean: any = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      clean[key] = cleanUndefined(obj[key]);
    }
  }
  return clean;
}

export async function addOrUpdateUserFirestore(user: User) {
  try {
    const cleaned = cleanUndefined(user);
    await setDoc(doc(db, "users", user.id), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.id}`);
  }
}

export async function addOrUpdateCategoryFirestore(category: Category) {
  try {
    const cleaned = cleanUndefined(category);
    await setDoc(doc(db, "categories", category.id), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `categories/${category.id}`);
  }
}

export async function deleteCategoryFirestore(id: string) {
  try {
    await deleteDoc(doc(db, "categories", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
  }
}

export async function addOrUpdateVideoFirestore(video: Video) {
  try {
    const cleaned = cleanUndefined(video);
    await setDoc(doc(db, "videos", video.id), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `videos/${video.id}`);
  }
}

export async function deleteVideoFirestore(id: string) {
  try {
    await deleteDoc(doc(db, "videos", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `videos/${id}`);
  }
}
