"use client";

// Components
import Navbar from "@components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ContactSection from "@/components/home/ContactSection";
import HomePageFooter from "@/components/home/HomePageFooter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ContactSection />
      
      <HomePageFooter />
    </div>
  );
}
