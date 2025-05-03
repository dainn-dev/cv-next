import { initializeApp } from "firebase/app"
import { getFirestore, onSnapshot, doc, collection, setDoc, writeBatch } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Collection names
const COLLECTIONS = {
  PROFILE: "profile",
  PORTFOLIO: "portfolio",
  SKILLS: "skills",
  TESTIMONIALS: "testimonials",
}

// Subscribe to profile updates
export function subscribeToProfileUpdates(callback: (data: any) => void) {
  const profileRef = doc(db, COLLECTIONS.PROFILE, "main")
  return onSnapshot(
    profileRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data())
      } else {
        callback(null)
      }
    },
    (error) => {
      console.error("Error subscribing to profile updates:", error)
    }
  )
}

// Subscribe to portfolio updates
export function subscribeToPortfolioUpdates(callback: (data: any[]) => void) {
  const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO)
  return onSnapshot(portfolioRef, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data()))
  })
}

// Subscribe to skills updates
export function subscribeToSkillsUpdates(callback: (data: any[]) => void) {
  const skillsRef = collection(db, COLLECTIONS.SKILLS)
  return onSnapshot(skillsRef, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data()))
  })
}

// Subscribe to testimonials updates
export function subscribeToTestimonialsUpdates(callback: (data: any[]) => void) {
  const testimonialsRef = collection(db, COLLECTIONS.TESTIMONIALS)
  return onSnapshot(testimonialsRef, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data()))
  })
}

// Subscribe to education updates
export function subscribeToEducationUpdates(callback: (data: any[]) => void) {
  const educationRef = collection(db, "education");
  return onSnapshot(educationRef, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

// Subscribe to experience updates
export function subscribeToExperienceUpdates(callback: (data: any[]) => void) {
  const experienceRef = collection(db, "experience");
  return onSnapshot(experienceRef, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

// Client-side save functions
export async function saveProfileClient(profile: any) {
  const ref = doc(db, COLLECTIONS.PROFILE, "main")
  await setDoc(ref, profile, { merge: true })
}

export async function savePortfolioItemsClient(items: any[]) {
  const batch = writeBatch(db)
  const colRef = collection(db, COLLECTIONS.PORTFOLIO)
  items.forEach((item) => {
    const docRef = doc(colRef, item.id || Math.random().toString(36).slice(2))
    batch.set(docRef, item)
  })
  await batch.commit()
}

export async function saveSkillsClient(skills: any[]) {
  const batch = writeBatch(db)
  const colRef = collection(db, COLLECTIONS.SKILLS)
  skills.forEach((skill, idx) => {
    const docRef = doc(colRef, `skill-${idx + 1}`)
    batch.set(docRef, { ...skill, order: idx })
  })
  await batch.commit()
}

export async function saveTestimonialsClient(testimonials: any[]) {
  const batch = writeBatch(db)
  const colRef = collection(db, COLLECTIONS.TESTIMONIALS)
  testimonials.forEach((testimonial, idx) => {
    const docRef = doc(colRef, `testimonial-${idx + 1}`)
    batch.set(docRef, { ...testimonial, order: idx })
  })
  await batch.commit()
}

// Save all education entries (overwrite)
export async function saveEducationClient(entries: any[]) {
  const batch = writeBatch(db);
  const colRef = collection(db, "education");
  entries.forEach((entry, idx) => {
    const docRef = doc(colRef, entry.id || `edu-${idx + 1}`);
    batch.set(docRef, entry);
  });
  await batch.commit();
}

// Save all experience entries (overwrite)
export async function saveExperienceClient(entries: any[]) {
  const batch = writeBatch(db);
  const colRef = collection(db, "experience");
  entries.forEach((entry, idx) => {
    const docRef = doc(colRef, entry.id || `exp-${idx + 1}`);
    batch.set(docRef, entry);
  });
  await batch.commit();
}

export { db, COLLECTIONS } 