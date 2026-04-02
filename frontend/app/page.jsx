"use client";
import About from "@/components/sections/About";
import Hero from "@/components/sections/Hero";
import Testomonials from "@/components/sections/Testomonials";
import { useLenis } from "@/hooks/useLenis";


const HomePage = () => {
  useLenis();
  return (
    <>
    <Hero />
    <About />
    <Testomonials />
    </>
  );
};

export default HomePage;
