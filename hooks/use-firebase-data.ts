"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase/config"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"

export function useFirebaseCollection(collectionName: string, orderByField?: string) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)

    let q
    if (orderByField) {
      q = query(collection(db, collectionName), orderBy(orderByField))
    } else {
      q = query(collection(db, collectionName))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setData(fetchedData)
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err)
        setError(err)
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [collectionName, orderByField])

  return { data, loading, error }
}

export function useFirebaseDocument(collectionName: string, documentId: string) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = onSnapshot(
      collection(db, collectionName, documentId),
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() })
        } else {
          setData(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching ${collectionName}/${documentId}:`, err)
        setError(err)
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [collectionName, documentId])

  return { data, loading, error }
}
