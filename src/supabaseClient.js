import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config'

// PKCE flow returns the session via a `?code=` query param instead of a
// `#access_token=` URL hash. That matters here specifically because the site
// uses HashRouter for page routing — an implicit-flow hash token would
// collide with React Router trying to read the same `#` as a route, and the
// login would silently lose the session in the process.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { flowType: 'pkce', detectSessionInUrl: true },
})
