import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { About } from '@/components/home/About';
import { PaintStatement } from '@/components/home/PaintStatement';
import { SelectedWork } from '@/components/home/SelectedWork';
import { Toolkit } from '@/components/home/Toolkit';
import { Experience } from '@/components/home/Experience';
import { Credentials } from '@/components/home/Credentials';
import { Contact } from '@/components/home/Contact';
import { TestLab } from '@/components/home/TestLab';
import { BugReport } from '@/components/home/BugReport';
import { LabProvider } from '@/components/lab/LabProvider';
import { LabModal } from '@/components/lab/LabModal';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <SelectedWork />
      <Toolkit />
      <LabProvider>
        <TestLab />
        <BugReport />
        <LabModal />
      </LabProvider>
      <About />
      <PaintStatement />
      <Experience />
      <Credentials />
      <Contact />
    </>
  );
}
