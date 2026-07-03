import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import SolanaWalletProvider from './context/SolanaWalletProvider'
import Navbar from './components/Navbar'
import PriceTicker from './components/PriceTicker'
import Footer from './components/Footer'
import Toasts from './components/Toasts'
import Home from './pages/Home'
import SubmitStory from './pages/SubmitStory'
import BrowseStories from './pages/BrowseStories'
import CreatorSpotlight from './pages/CreatorSpotlight'
import Guide from './pages/Guide'
import StoryDetail from './pages/StoryDetail'
import GiveBack from './pages/GiveBack'
import BecomeSupporter from './pages/BecomeSupporter'
import SupporterDirectory from './pages/SupporterDirectory'
import GivingListPage from './pages/GivingListPage'
import About from './pages/About'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <SolanaWalletProvider>
    <AppProvider>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <PriceTicker />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SubmitStory />} />
            <Route path="/guide" element={<Guide />} />
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
