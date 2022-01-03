import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";
import { MusicNoteIcon } from "@heroicons/react/solid";
import { playlistIdState } from "../atoms/playlistAtom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function RecentlyPlayedSong({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentPlaylistId] = useRecoilState(playlistIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    // if (currentTrackId == track.track.id) return;
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className={classNames(
        track.track.id == currentTrackId
          ? "grid grid-cols-2 text-gray-400 py-4 px-5 bg-zinc-800 hover:bg-zinc-800 rounded-md cursor-pointer"
          : "grid grid-cols-2 text-gray-400 py-4 px-5 hover:bg-zinc-700 rounded-md cursor-pointer",
        "grid grid-cols-2 text-gray-400 py-4 px-5 hover:bg-zinc-800 rounded-md cursor-pointer"
      )}
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        {track.track.id == currentTrackId ? (
          <>
            <MusicNoteIcon className="text-[#0cbb2f] w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out" />
          </>
        ) : (
          <p></p>
        )}
        <img
          className="h-10 w-10 rounded-xl"
          src={track.track.album.images[0].url}
          alt={track.track.album.name}
        />
        <div>
          <p
            className={classNames(
              track.track.id == currentTrackId
                ? "w-36 lg:w-64 text-[#0cbb2f] truncate"
                : "w-36 lg:w-64 text-white truncate"
            )}
          >
            {track.track.name}
          </p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default RecentlyPlayedSong;
