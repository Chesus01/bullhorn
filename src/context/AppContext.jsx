import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { MOCK_STORIES, MOCK_SUPPORTERS } from '../data/mockData'
import { supabase } from '../supabaseClient'

const AppContext = createContext(null)

let nextId = 100

export function AppProvider({ children }) {
  const [stories, setStories] = useState(MOCK_STORIES)
  const [supporters, setSupporters] = useState(MOCK_SUPPORTERS)
  const [givingList, setGivingList] = useState([]) // [{ storyId, note }]
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = ++nextId
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  // Stories live in Supabase so a submission is visible to every visitor, not
  // just the submitter's own browser. Loaded once on mount; writes below are
  // optimistic (update local state immediately, then sync in the background).
  useEffect(() => {
    let cancelled = false
    supabase
      .from('stories')
      .select('data')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          toast('Could not load stories from the database.', 'error')
          return
        }
        if (data) setStories(data.map((row) => row.data))
      })
    return () => { cancelled = true }
  }, [toast])

  const updateStory = useCallback((id, patch) => {
    setStories((list) => {
      const next = list.map((s) =>
        s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch) } : s
      )
      const updated = next.find((s) => s.id === id)
      if (updated) {
        supabase
          .from('stories')
          .update({ status: updated.status, featured: updated.featured, data: updated })
          .eq('id', id)
          .then(({ error }) => { if (error) toast('Change saved locally, but failed to sync.', 'error') })
      }
      return next
    })
  }, [toast])

  const addStory = useCallback((story) => {
    const id = `s${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
    const full = { ...story, id }
    setStories((list) => [full, ...list])
    supabase
      .from('stories')
      .insert({ id, status: full.status, featured: !!full.featured, data: full })
      .then(({ error }) => { if (error) toast('Story saved locally, but failed to sync to the database.', 'error') })
    return id
  }, [toast])

  const addSupporter = useCallback((sup) => {
    const id = `sup${++nextId}`
    setSupporters((list) => [...list, { ...sup, id }])
    return id
  }, [])

  const inGivingList = useCallback(
    (storyId) => givingList.some((g) => g.storyId === storyId),
    [givingList]
  )

  const addToGivingList = useCallback(
    (storyId) => {
      setGivingList((list) =>
        list.some((g) => g.storyId === storyId) ? list : [...list, { storyId, note: '' }]
      )
    },
    []
  )

  const removeFromGivingList = useCallback((storyId) => {
    setGivingList((list) => list.filter((g) => g.storyId !== storyId))
  }, [])

  const clearGivingList = useCallback(() => setGivingList([]), [])

  const setGivingNote = useCallback((storyId, note) => {
    setGivingList((list) => list.map((g) => (g.storyId === storyId ? { ...g, note } : g)))
  }, [])

  const value = {
    stories,
    supporters,
    givingList,
    toasts,
    toast,
    updateStory,
    addStory,
    addSupporter,
    inGivingList,
    addToGivingList,
    removeFromGivingList,
    clearGivingList,
    setGivingNote,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
