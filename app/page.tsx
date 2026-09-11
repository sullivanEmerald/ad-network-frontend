import { AppLayout } from "@/components/home/layout";
import HeroSection from "@/components/sections/heroSection";

export const metadata = {
  title: 'Custex - Home',
  description: 'Custex is a cutting-edge SaaS advertising platform designed to empower businesses with advanced tools for managing and optimizing their advertising campaigns.',
}

export default function Home() {
  return (
    <AppLayout>
      <HeroSection />
    </AppLayout>
  );
}
