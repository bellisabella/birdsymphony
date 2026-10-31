import { AboutSection } from '@/components/about-section'
import { ExperiencePreview } from '@/components/experience-preview'
import { HeroSection } from '@/components/hero-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { VideoUpload } from '@/components/video-upload'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <VideoUpload />
        <ExperiencePreview />
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  )
}
