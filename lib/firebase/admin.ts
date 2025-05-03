import { initializeApp, getApps, cert, App } from "firebase-admin/app"
import { getFirestore, Firestore } from "firebase-admin/firestore"

let adminDb: Firestore | null = null

// Check if Firebase Admin is already initialized
const apps = getApps()

// If not initialized and we have the required environment variables, initialize Firebase Admin
if (!apps.length && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    })
    adminDb = getFirestore(app)
  } catch (error) {
    console.error("Firebase admin initialization error:", error)
    // Don't throw the error, just log it
  }
}

export { adminDb }
