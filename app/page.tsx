import { AppLayout } from "@/components/home/layout";
import HeroSection from "@/components/sections/heroSection";
import { Hero } from "@/components/landing/Hero";
import { Objectives } from "@/components/landing/Objective";
import { FunnelFeature } from "@/components/landing/FunnelFeature";
import { Announcement } from "@/components/landing/Announcement,";
import { Newsroom } from "@/components/landing/NewsRoom";
import { ProductSolutions } from "@/components/landing/ProductSolutions";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CaseStudies } from "@/components/landing/CaseStudies";
import { ExploreMore } from "@/components/landing/ExploreMore";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/finalCTA";
import AdsHero from "@/components/landing/adsHero";

export const metadata = {
  title: 'Custex - Home',
  description: 'Custex is a cutting-edge SaaS advertising platform designed to empower businesses with advanced tools for managing and optimizing their advertising campaigns.',
}

export default function BusinessLandingPage() {
  return (
    <AppLayout>
      <AdsHero />
      <Hero />
      <Objectives />
      <FunnelFeature />
      <Announcement />
      <Newsroom />
      <ProductSolutions />
      <HowItWorks />
      <CaseStudies />
      <ExploreMore />
      <FAQ />
      <FinalCTA />
    </AppLayout>
  );
}
