import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { MOCK_STORIES, MOCK_SUPPORTERS } from '../data/mockData'
import { supabase } from '../supabaseClient'

const AppContext = createContext(null)

let nextId = 100

export function AppProvider({ children }) {
  const [stories, setStories] = useState(MOCK_STORIES)
  const [supporters, setSupporters] = useState(MOCK_SUPPORTERS)
  const [givingList, setGivingList] = useState([]) // [{ storyId, note }]
  const [confirmations, setConfirmations] = useState([])
  const [tools, setTools] = useState([])
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

  // Public giving ledger — loaded once, same pattern as stories above.
  useEffect(() => {
    let cancelled = false
    supabase
      .from('story_confirmations')
      .select('*')
      .then(({ data, error }) => {
        if (cancelled || error) return
        setConfirmations(
          data.map((r) => ({
            id: r.id,
            storyId: r.story_id,
            txSignature: r.tx_signature,
            amount: Number(r.amount),
            token: r.token,
            confirmedAt: r.confirmed_at,
          }))
        )
      })
    return () => { cancelled = true }
  }, [])

  const addConfirmation = useCallback(async (storyId, txSignature, amount, token) => {
    const { data, error } = await supabase
      .from('story_confirmations')
      .insert({ story_id: storyId, tx_signature: txSignature, amount, token })
      .select()
      .single()
    if (!error) {
      setConfirmations((list) => [
        ...list,
        { id: data.id, storyId, txSignature, amount, token, confirmedAt: data.confirmed_at },
      ])
    }
    return { error }
  }, [])

  // Supporters live in Supabase too — same reasoning as stories above. A
  // "Become a Supporter" submission needs to be visible to every visitor,
  // not just saved in the submitter's own browser.
  useEffect(() => {
    let cancelled = false
    supabase
      .from('supporters')
      .select('data')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled || error) return
        if (data) setSupporters(data.map((row) => row.data))
      })
    return () => { cancelled = true }
  }, [])

  // Lets a creator claim their own story's wallet by X login, via a
  // narrow server-side function (see claim_story_wallet in schema.sql) —
  // not a generic update, so it can't touch anything but the wallet.
  const claimStoryWallet = useCallback(async (storyId, wallet) => {
    const { error } = await supabase.rpc('claim_story_wallet', { p_story_id: storyId, p_wallet: wallet })
    if (!error) {
      setStories((list) => list.map((s) => (s.id === storyId ? { ...s, walletAddress: wallet, walletVerified: true } : s)))
    }
    return { error }
  }, [])

  const addSupporter = useCallback((sup) => {
    const id = `sup${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
    const full = { ...sup, id }
    setSupporters((list) => [full, ...list])
    supabase
      .from('supporters')
      .insert({ id, data: full })
      .then(({ error }) => { if (error) toast('Saved locally, but failed to sync to the database.', 'error') })
    return id
  }, [toast])

  // Community tools directory — hand-curated from Admin, not user-submitted.
  useEffect(() => {
    let cancelled = false
    supabase
      .from('community_tools')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled || error) return
        setTools(
          data.map((r) => ({
            id: r.id,
            name: r.name,
            url: r.url,
            description: r.description,
            sharedBy: r.shared_by,
            createdAt: r.created_at,
          }))
        )
      })
    return () => { cancelled = true }
  }, [])

  const addTool = useCallback(async (tool) => {
    const { data, error } = await supabase
      .from('community_tools')
      .insert({ name: tool.name, url: tool.url, description: tool.description, shared_by: tool.sharedBy })
      .select()
      .single()
    if (!error) {
      setTools((list) => [
        { id: data.id, name: data.name, url: data.url, description: data.description, sharedBy: data.shared_by, createdAt: data.created_at },
        ...list,
      ])
    }
    return { error }
  }, [])

  const removeTool = useCallback(async (id) => {
    setTools((list) => list.filter((t) => t.id !== id))
    const { error } = await supabase.from('community_tools').delete().eq('id', id)
    if (error) toast('Failed to delete — it may reappear on reload.', 'error')
  }, [toast])

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
    confirmations,
    addConfirmation,
    claimStoryWallet,
    tools,
    addTool,
    removeTool,
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
