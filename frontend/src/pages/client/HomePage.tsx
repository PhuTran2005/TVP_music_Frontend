import { Hero } from "../../components/Hero";
import { FeaturedAlbums } from "../../components/FeaturedAlbums";
import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { FeaturedPlaylists } from "@/components/FeaturedPlaylists";
import { TopFeaturedTracks } from "@/components/TopFeaturedTracks.tsx";
import { FeaturedGenres } from "@/components/FeaturedGenres";

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedAlbums />
      <FeaturedPlaylists />
      <ArtistSpotlight />
      <FeaturedGenres />
      <TopFeaturedTracks />
    </>
  );
}
export default HomePage;
