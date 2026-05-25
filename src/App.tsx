import { useEffect, useState } from 'react'
import './i18n'
import Navigation from './sections/Navigation'
import CoreJourney from './sections/CoreJourney'
import Work from './sections/Work'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import LoadingScreen from './sections/LoadingScreen'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="relative min-h-[100dvh] bg-void text-text">
      <Navigation />
      <main className="relative z-10">
        <CoreJourney />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
