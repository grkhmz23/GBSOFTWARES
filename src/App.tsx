import { useState, useEffect, useCallback } from 'react';
import { useLenis } from './hooks/useLenis';
import { StageProvider } from './contexts/StageContext';
import PageLoader from './components/PageLoader';
import ParticleField from './components/ParticleField';
import Header from './components/Header';
import HeroSection from './sections/HeroSection';
import WorkGridSection from './sections/WorkGridSection';
import CapabilitiesSection from './sections/CapabilitiesSection';
import ProcessSection from './sections/ProcessSection';
import SkillsSection from './sections/SkillsSection';
import ExperienceSection from './sections/ExperienceSection';
import CaseStudySection from './sections/CaseStudySection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import PrivacyPolicy from './sections/PrivacyPolicy';

function App() {
  useLenis();
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      setShowPrivacy(window.location.hash === '#/privacy');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const openPrivacy = useCallback(() => {
    window.location.hash = '#/privacy';
    setShowPrivacy(true);
  }, []);

  const closePrivacy = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    setShowPrivacy(false);
  }, []);

  if (showPrivacy) {
    return <PrivacyPolicy onClose={closePrivacy} />;
  }

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
        <Footer onPrivacyClick={openPrivacy} />
      </main>
    </StageProvider>
  );
}

export default App;
