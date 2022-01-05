import { useRecoilValue } from "recoil";
import { topTracksState } from "../atoms/homePageAtom";
import TopTrack from "./TopTrack";

function TopTracks() {
  const topTracks = useRecoilValue(topTracksState);

  return (
    <div className="px-6 flex flex-col mt-3 space-y-2 pb-28 text-white">
      {topTracks?.items.map((track, i) => (
        <TopTrack key={track.id} track={track} order={i} />
      ))}
    </div>
  );
}

export default TopTracks;
