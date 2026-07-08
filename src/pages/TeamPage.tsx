import { CyberBackground } from '../components/landing/CyberBackground'
import { TeamNavbar } from '../components/team/TeamNavbar'
import { TeamHero } from '../components/team/TeamHero'
import { TeamIntro } from '../components/team/TeamIntro'
import { TeamMembers } from '../components/team/TeamMembers'
import { TeamMission } from '../components/team/TeamMission'
import { TeamTech } from '../components/team/TeamTech'
import { TeamCTA } from '../components/team/TeamCTA'
import { TeamFooter } from '../components/team/TeamFooter'

export function TeamPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <CyberBackground />
      <TeamNavbar />
      <TeamHero />
      <TeamIntro />
      <TeamMembers />
      <TeamMission />
      <TeamTech />
      <TeamCTA />
      <TeamFooter />
    </div>
  )
}
