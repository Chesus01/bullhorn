import { createContext, useCallback, useContext, useState } from 'react'
import { MOCK_STORIES, MOCK_SUPPORTERS } from '../data/mockData'

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

  const updateStory = useCallback((id, patch) => {
    setStories((list) =>
      list.map((s) =>
        s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch) } : s
      )
    )
  }, [])

  const addStory = useCallback((story) => {
    const id = `s${++nextId}`
    setStories((list) => [{ ...story, id }, ...list])
    return id
  }, [])

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
