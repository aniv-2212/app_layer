import { CyberBackground } from '../components/landing/CyberBackground'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { HeroSection } from '../components/landing/HeroSection'
import { PlatformSection } from '../components/landing/PlatformSection'
import { DashboardPreview } from '../components/landing/DashboardPreview'
import { VyomxProtocol } from '../components/landing/VyomxProtocol'
import { LandingFooter } from '../components/landing/LandingFooter'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <CyberBackground />
      <LandingNavbar />
      <HeroSection />
      <PlatformSection />
      <DashboardPreview />
      <VyomxProtocol />
      <LandingFooter />
    </div>
  )
}
