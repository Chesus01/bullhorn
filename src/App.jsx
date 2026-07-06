import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'
import SolanaWalletProvider from './context/SolanaWalletProvider'
import IntroVideo from './components/IntroVideo'
import Navbar from './components/Navbar'
import BuyBanner from './components/BuyBanner'
import PriceTicker from './components/PriceTicker'
import Footer from './components/Footer'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import SubmitStory from './pages/SubmitStory'
import BrowseStories from './pages/BrowseStories'
import CreatorSpotlight from './pages/CreatorSpotlight'
import Guide from './pages/Guide'
import HowToBuy from './pages/HowToBuy'
import MyStories from './pages/MyStories'
import StoryDetail from './pages/StoryDetail'
import GiveBack from './pages/GiveBack'
import BecomeSupporter from './pages/BecomeSupporter'
import SupporterDirectory from './pages/SupporterDirectory'
import GivingListPage from './pages/GivingListPage'
import About from './pages/About'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

// Lazy-loaded: react-globe.gl pulls in three.js, which is heavy — no reason
// to add that to every visitor's initial bundle when only /map needs it.
const GlobalMap = lazy(() => import('./pages/GlobalMap'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  // Only splash on a fresh landing at the root — deep links people share
  // (like a story link on X) should open straight to the content, and it
  // only plays once per browser session, not on every internal navigation.
  const [showIntro, setShowIntro] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    const isRoot = hash === '' || hash === '/'
    return isRoot && !sessionStorage.getItem('bullhorn_intro_seen')
  })

  return (
    <SolanaWalletProvider>
    <AppProvider>
      {showIntro && <IntroVideo onDone={() => setShowIntro(false)} />}
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <PriceTicker />
        <Navbar />
        <BuyBanner />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SubmitStory />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/how-to-buy" element={<HowToBuy />} />
            <Route path="/my-stories" element={<MyStories />} />
            <Route
              path="/map"
              element={
                <Suspense fallback={<div className="container section center muted">Loading globe…</div>}>
                  <GlobalMap />
                </Suspense>
              }
            />
            <Route path="/stories" element={<BrowseStories />} />
            <Route path="/spotlight" element={<CreatorSpotlight />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/give-back" element={<GiveBack />} />
            <Route path="/become-supporter" element={<BecomeSupporter />} />
            <Route path="/supporters" element={<SupporterDirectory />} />
            <Route path="/giving-list" element={<GivingListPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toasts />
      </HashRouter>
    </AppProvider>
    </SolanaWalletProvider>
  )
}
