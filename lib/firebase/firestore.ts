import { adminDb } from "./admin"

// Collection names
const COLLECTIONS = {
  PROFILE: "profile",
  PORTFOLIO: "portfolio",
  SKILLS: "skills",
  TESTIMONIALS: "testimonials",
}

// Get profile data
export async function getProfileFromFirebase() {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    return null
  }

  try {
    const profileRef = adminDb.collection(COLLECTIONS.PROFILE).doc("main")
    const profileDoc = await profileRef.get()

    if (profileDoc.exists) {
      return profileDoc.data()
    }

    return null
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}

// Update profile data
export async function updateProfileInFirebase(profileData: any) {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    throw new Error("Firebase Admin is not initialized")
  }

  try {
    const profileRef = adminDb.collection(COLLECTIONS.PROFILE).doc("main")
    
    // Check if the document exists
    const doc = await profileRef.get()
    if (!doc.exists) {
      // Create the document if it doesn't exist
      await profileRef.set(profileData)
    } else {
      // Update the document if it exists
      await profileRef.set(profileData, { merge: true })
    }
    
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update profile")
  }
}

// Get portfolio items
export async function getPortfolioItemsFromFirebase() {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    return []
  }

  try {
    const portfolioRef = adminDb.collection(COLLECTIONS.PORTFOLIO)
    const snapshot = await portfolioRef.orderBy("id").get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error("Error getting portfolio items:", error)
    return []
  }
}

// Update portfolio items
export async function updatePortfolioItemsInFirebase(items: any[]) {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    throw new Error("Firebase Admin is not initialized")
  }

  try {
    const batch = adminDb.batch()

    // Delete existing items
    const portfolioRef = adminDb.collection(COLLECTIONS.PORTFOLIO)
    const existingItems = await portfolioRef.get()
    existingItems.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Add new items
    items.forEach((item, index) => {
      const itemWithId = { ...item, id: item.id || `item-${index + 1}` }
      const docRef = portfolioRef.doc(itemWithId.id.toString())
      batch.set(docRef, itemWithId)
    })

    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error("Error updating portfolio items:", error)
    throw new Error("Failed to update portfolio items")
  }
}

// Get skills
export async function getSkillsFromFirebase() {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    return []
  }

  try {
    const skillsRef = adminDb.collection(COLLECTIONS.SKILLS)
    const snapshot = await skillsRef.orderBy("order").get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error("Error getting skills:", error)
    return []
  }
}

// Update skills
export async function updateSkillsInFirebase(skills: any[]) {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    throw new Error("Firebase Admin is not initialized")
  }

  try {
    const batch = adminDb.batch()

    // Delete existing skills
    const skillsRef = adminDb.collection(COLLECTIONS.SKILLS)
    const existingSkills = await skillsRef.get()
    existingSkills.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Add new skills
    skills.forEach((skill, index) => {
      const skillWithOrder = { ...skill, order: index }
      const docRef = skillsRef.doc(`skill-${index + 1}`)
      batch.set(docRef, skillWithOrder)
    })

    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error("Error updating skills:", error)
    throw new Error("Failed to update skills")
  }
}

// Get testimonials
export async function getTestimonialsFromFirebase() {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    return []
  }

  try {
    const testimonialsRef = adminDb.collection(COLLECTIONS.TESTIMONIALS)
    const snapshot = await testimonialsRef.orderBy("order").get()

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error("Error getting testimonials:", error)
    return []
  }
}

// Update testimonials
export async function updateTestimonialsInFirebase(testimonials: any[]) {
  if (!adminDb) {
    console.error("Firebase Admin is not initialized")
    throw new Error("Firebase Admin is not initialized")
  }

  try {
    const batch = adminDb.batch()

    // Delete existing testimonials
    const testimonialsRef = adminDb.collection(COLLECTIONS.TESTIMONIALS)
    const existingTestimonials = await testimonialsRef.get()
    existingTestimonials.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Add new testimonials
    testimonials.forEach((testimonial, index) => {
      const testimonialWithOrder = { ...testimonial, order: index }
      const docRef = testimonialsRef.doc(`testimonial-${index + 1}`)
      batch.set(docRef, testimonialWithOrder)
    })

    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error("Error updating testimonials:", error)
    throw new Error("Failed to update testimonials")
  }
}
