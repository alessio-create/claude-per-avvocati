import { Nav } from '../components/marketing/Nav';
import { Hero } from '../components/marketing/Hero';
import { ClaudeScenes } from '../components/marketing/ClaudeScenes';
import { TrustStrip } from '../components/marketing/TrustStrip';
import { StackHub } from '../components/marketing/StackHub';
import { Numeri } from '../components/marketing/Numeri';
import { ChiSiamoProblema } from '../components/marketing/ChiSiamoProblema';
import { MeccanismoPyramid } from '../components/marketing/MeccanismoPyramid';
import { MeccanismoChart } from '../components/marketing/MeccanismoChart';
import { Programma } from '../components/marketing/Programma';
import { Outcomes } from '../components/marketing/Outcomes';
import { Bonus } from '../components/marketing/Bonus';
import { Pricing } from '../components/marketing/Pricing';
import { FAQ } from '../components/marketing/FAQ';
import { FinalCTA } from '../components/marketing/FinalCTA';
import { Foot } from '../components/marketing/Foot';
import { Reveal } from '../components/marketing/Reveal';

export default function Home() {
  return (
    <>
      <Nav />
      {/* Hero stays un-revealed, it's above the fold and already animated */}
      <Hero />
      <TrustStrip />
      <Reveal><StackHub /></Reveal>
      <Reveal><ChiSiamoProblema /></Reveal>
      <Reveal><Numeri /></Reveal>
      <Reveal>
        <section className="bg-cream-panel py-20 px-8">
          <MeccanismoPyramid />
          <MeccanismoChart />
        </section>
      </Reveal>
      <Reveal><Programma /></Reveal>
      <Reveal><Outcomes /></Reveal>
      <Reveal><ClaudeScenes /></Reveal>
      <Reveal><Bonus /></Reveal>
      <Reveal><Pricing /></Reveal>
      <Reveal><FAQ /></Reveal>
      <Reveal><FinalCTA /></Reveal>
      <Foot />
    </>
  );
}
