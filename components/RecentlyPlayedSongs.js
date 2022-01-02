import { useRecoilValue } from "recoil";
import { recentlyPlayedTracks } from "../atoms/homePageAtom";
import RecentlyPlayedSong from "./RecentlyPlayedSong";

function RecentlyPlayedSongs() {
  const recentlyPlayedState = useRecoilValue(recentlyPlayedTracks);

  return (
    <div className="px-6 flex flex-col mt-3 space-y-2 pb-28 text-white">
      {recentlyPlayedState?.items.map((track, i) => (
        <RecentlyPlayedSong key={track.track.id} track={track} order={i} />
      ))}
    </div>
  );
}

export default RecentlyPlayedSongs;
