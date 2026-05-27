import { useLenis } from './hooks/useLenis'
import { StageProvider } from './contexts/StageContext'
import PageLoader from './components/PageLoader'
import ParticleField from './components/ParticleField'
import Header from './components/Header'
import HeroSection from './sections/HeroSection'
import WorkGridSection from './sections/WorkGridSection'
import CapabilitiesSection from './sections/CapabilitiesSection'
import ProcessSection from './sections/ProcessSection'
import SkillsSection from './sections/SkillsSection'
import ExperienceSection from './sections/ExperienceSection'
import CaseStudySection from './sections/CaseStudySection'
import ContactSection from './sections/ContactSection'
import Footer from './sections/Footer'

function App() {
  useLenis()

  return (
    <StageProvider>
      <PageLoader />
      <ParticleField />
      <Header />
      <main>
        <HeroSection />
        <WorkGridSection />
        <CapabilitiesSection />
        <ProcessSection />
        <SkillsSection />
        <ExperienceSection />
        <CaseStudySection />
        <ContactSection />
        <Footer />
      </main>
    </StageProvider>
  )
}

export default App
