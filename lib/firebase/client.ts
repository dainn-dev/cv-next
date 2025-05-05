import { initializeApp } from "firebase/app"
import { getFirestore, onSnapshot, doc, collection, setDoc, writeBatch, getDocs, query, orderBy } from "firebase/firestore"

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

interface Fact {
  id?: string
  icon: string
  count: number
  title: string
  description: string
}

interface FactsData {
  intro: {
    title: string
    description: string
  }
  facts: Fact[]
}

interface TechnicalSkill {
  category: string
  details: string
}

interface SkillsData {
  intro: {
    title: string
    description: string
  }
  technicalSkills: TechnicalSkill[]
  softSkills: string[]
}

interface PortfolioIntro {
  title: string
  description: string
}

interface PortfolioItem {
  id?: string
  title: string
  category: string
  imageUrl: string
  detailsUrl?: string
}

interface PortfolioData {
  intro: PortfolioIntro
  items: PortfolioItem[]
}

interface Testimonial {
  name: string
  position: string
  text: string
  imageUrl: string
}

interface TestimonialsData {
  intro: {
    title: string
    description: string
  }
  testimonials: Testimonial[]
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
export function subscribeToPortfolioUpdates(callback: (data: PortfolioData) => void) {
  const ref = doc(db, COLLECTIONS.PORTFOLIO, "data")
  return onSnapshot(ref, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as PortfolioData)
    } else {
      callback({
        intro: {
          title: "Portfolio",
          description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
        },
        items: [],
      })
    }
  })
}

// Subscribe to skills updates
export function subscribeToSkillsUpdates(callback: (data: SkillsData) => void) {
  const docRef = doc(db, "skills", "data")
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data() as SkillsData
      callback(data)
    } else {
      callback({
        intro: {
          title: "Skills",
          description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
        },
        technicalSkills: [],
        softSkills: [],
      })
    }
  })
}

// Subscribe to testimonials updates
export function subscribeToTestimonialsUpdates(callback: (data: TestimonialsData) => void) {
  const testimonialsRef = doc(db, COLLECTIONS.TESTIMONIALS, "data")
  return onSnapshot(testimonialsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as TestimonialsData)
    } else {
      callback({
        intro: {
          title: "Testimonials",
          description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
        },
        testimonials: [],
      })
    }
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

export async function savePortfolioItemsClient(data: PortfolioData) {
  const ref = doc(db, COLLECTIONS.PORTFOLIO, "data")
  await setDoc(ref, data)
}

export async function saveSkillsClient(data: SkillsData) {
  try {
    const docRef = doc(db, "skills", "data")
    await setDoc(docRef, data)
  } catch (error) {
    console.error("Error saving skills:", error)
    throw error
  }
}

export async function saveTestimonialsClient(data: TestimonialsData) {
  const ref = doc(db, COLLECTIONS.TESTIMONIALS, "data")
  await setDoc(ref, data)
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

export async function saveFactsClient(data: FactsData) {
  const factsRef = doc(db, "facts", "data")
  await setDoc(factsRef, data)
}

export function subscribeToFactsUpdates(callback: (data: FactsData) => void) {
  const factsRef = doc(db, "facts", "data")
  return onSnapshot(factsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as FactsData)
    } else {
      callback({
        intro: {
          title: "Facts",
          description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
        },
        facts: [],
      })
    }
  })
}

export async function saveCertificatesClient(certificates: any[]) {
  const certificatesRef = collection(db, "certificates")
  const batch = writeBatch(db)

  // Delete existing certificates
  const existingDocs = await getDocs(certificatesRef)
  existingDocs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  // Add new certificates
  certificates.forEach((cert) => {
    const newDocRef = doc(certificatesRef)
    batch.set(newDocRef, {
      ...cert,
      id: newDocRef.id,
    })
  })

  await batch.commit()
}

export function subscribeToCertificatesUpdates(callback: (data: any[]) => void) {
  const certificatesRef = collection(db, "certificates")
  const q = query(certificatesRef, orderBy("date", "desc"))

  return onSnapshot(q, (snapshot) => {
    const certificates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(certificates)
  })
}

export async function saveServicesClient(data: { intro: { title: string; description: string }; services: any[] }) {
  const servicesRef = doc(db, "services", "data")
  await setDoc(servicesRef, data)
}

export function subscribeToServicesUpdates(callback: (data: { intro: { title: string; description: string }; services: any[] }) => void) {
  const servicesRef = doc(db, "services", "data")
  return onSnapshot(servicesRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as { intro: { title: string; description: string }; services: any[] })
    } else {
      callback({
        intro: {
          title: "Services",
          description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
        },
        services: [],
      })
    }
  })
}

export { db, COLLECTIONS } 