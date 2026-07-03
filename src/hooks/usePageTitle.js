import { useEffect } from 'react'

const SITE_NAME = 'Bullhorn'

// Sets the browser tab title per page/story so tabs are distinguishable and
// shared links look right when bookmarked.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} — ${SITE_NAME}`
      : `${SITE_NAME} — Real stories. Real wallets. Real people.`
  }, [title])
}
