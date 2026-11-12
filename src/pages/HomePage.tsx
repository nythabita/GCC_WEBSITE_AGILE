import type { HomepageContent } from "../../shared/homepage";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import ProgramsSection from "../components/home/ProgramsSection";
import StartingPointSection from "../components/home/StartingPointSection";
import TrackRecordSection from "../components/home/TrackRecordSection";
import WinnersSection from "../components/home/WinnersSection";
import MentorsSection from "../components/home/MentorsSection";
import CollaborationsSection from "../components/home/CollaborationsSection";
import CommunitySection from "../components/home/CommunitySection";

export default function HomePage({ content }: { content: HomepageContent }) {
  return (
    <main className="bg-paper">
      {content.contentStatus === "example" && (
        <div className="border-b border-line bg-brand-cream py-3">
          <p className="page-container text-sm">{content.notice}</p>
        </div>
      )}
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      <ProgramsSection content={content.journey} />
      <StartingPointSection />
      <TrackRecordSection />
      <WinnersSection />
      <MentorsSection />
      <CollaborationsSection />
      <CommunitySection />
    </main>
  );
}
