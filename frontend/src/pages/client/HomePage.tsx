import { Hero } from "../../components/Hero";
import { FeaturedAlbums } from "../../components/FeaturedAlbums";
import { ArtistSpotlight } from "../../components/ArtistSpotlight";
import { RealtimeChart } from "@/components/TopTrackChart";

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedAlbums />
      <ArtistSpotlight />
      <RealtimeChart />
    </>
  );
}
export default HomePage;
