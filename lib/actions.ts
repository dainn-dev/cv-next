"use server"

import {
  getProfileFromFirebase,
  updateProfileInFirebase,
  getPortfolioItemsFromFirebase,
  updatePortfolioItemsInFirebase,
  getSkillsFromFirebase,
  updateSkillsInFirebase,
  getTestimonialsFromFirebase,
  updateTestimonialsInFirebase,
} from "./firebase/firestore"

// Profile data actions
export async function updateProfile(profileData: any) {
  return updateProfileInFirebase(profileData)
}

export async function getProfile() {
  return getProfileFromFirebase()
}

// Portfolio items actions
export async function updatePortfolioItems(items: any[]) {
  return updatePortfolioItemsInFirebase(items)
}

export async function getPortfolioItems() {
  return getPortfolioItemsFromFirebase()
}

// Skills actions
export async function updateSkills(skills: any[]) {
  return updateSkillsInFirebase(skills)
}

export async function getSkills() {
  return getSkillsFromFirebase()
}

// Testimonials actions
export async function updateTestimonials(testimonials: any[]) {
  return updateTestimonialsInFirebase(testimonials)
}

export async function getTestimonials() {
  return getTestimonialsFromFirebase()
}
