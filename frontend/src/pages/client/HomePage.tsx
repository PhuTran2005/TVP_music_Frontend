import { Hero } from "../../components/Hero";
import { FeaturedAlbums } from "../../components/FeaturedAlbums";
import { ArtistSpotlight } from "../../components/ArtistSpotlight";

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedAlbums />
      <ArtistSpotlight />
    </>
  );
}
export default HomePage;
