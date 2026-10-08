import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { SelectedWork } from '@/components/home/SelectedWork';
import { Strengths } from '@/components/home/Strengths';
import { FlowQASpotlight } from '@/components/home/FlowQASpotlight';
import { Experience } from '@/components/home/Experience';
import { Credentials } from '@/components/home/Credentials';
import { Contact } from '@/components/home/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Strengths />
      <FlowQASpotlight />
      <Experience />
      <Credentials />
      <Contact />
    </>
  );
}
