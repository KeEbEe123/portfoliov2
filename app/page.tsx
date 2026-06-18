import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DotMatrixPet from "@/components/DotMatrixPet";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import BeyondCode from "@/components/BeyondCode";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <DotMatrixPet />
      <main>
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Experience />
        <BeyondCode />
        <Contact />
      </main>
    </>
  );
}
