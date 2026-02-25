import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './i18n'
import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import Metrics from './sections/Metrics'
import Services from './sections/Services'
import Work from './sections/Work'
import Process from './sections/Process'
import Security from './sections/Security'
import FAQ from './sections/FAQ'
import Booking from './sections/Booking'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import LoadingScreen from './sections/LoadingScreen'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Initialize scroll animations after loading
      const ctx = gsap.context(() => {
        // Refresh ScrollTrigger after content loads
        ScrollTrigger.refresh()
      }, mainRef)

      return () => ctx.revert()
    }
  }, [isLoading])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div ref={mainRef} className="relative min-h-screen bg-void text-text overflow-x-hidden">
      {/* Global grid pattern background */}
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="relative z-10">
        <Hero />
        <Metrics />
        <Services />
        <Work />
        <Process />
        <Security />
        <FAQ />
        <Booking />
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
