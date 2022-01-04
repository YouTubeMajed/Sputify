import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  HeartIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Link from "next/link";
import { recentlyPlayedTracks } from "../atoms/homePageAtom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayedTrack, setRecentlyPlayedTrack] =
    useRecoilState(recentlyPlayedTracks);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getUserPlaylists()
        .then((data) => {
          setPlaylists(data.body.items);
          if (playlistId === null) setPlaylistId(data.body.items[0].id);
        })
        .catch((err) => console.log(err));
      spotifyApi
        .getMyRecentlyPlayedTracks({ limit: 4 })
        .then((data) => {
          setRecentlyPlayedTrack(data.body);
        })
        .catch((err) => console.log(err));
    }
  }, [session, spotifyApi]);

  return (
    <footer>
      <div className="text-gray-400 p-5 text-sm lg:text-xs border-r border-black overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex">
        <div className="space-y-4">
          <button className="flex items-center space-x-2 hover:text-white">
            <HomeIcon className="h-5 w-5" />
            <Link href="/home">
              <p>Home</p>
            </Link>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <SearchIcon className="h-5 w-5" />
            <p>Search</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <LibraryIcon className="h-5 w-5" />
            <p>Your Library</p>
          </button>

          <hr className="border-t-[0.1px] border-gray-900" />

          <button className="flex items-center space-x-2 hover:text-white">
            <PlusCircleIcon className="h-5 w-5" />
            <p>Create Playlist</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <HeartIcon className="h-5 w-5" />
            <p>Liked Songs</p>
          </button>
          <button className="flex items-center space-x-2 hover:text-white">
            <RssIcon className="h-5 w-5" />
            <Link href="/">
              <p>Your Playlists</p>
            </Link>
          </button>

          <hr className="border-t-[0.1px] border-gray-900" />

          {/* Playlists */}
          {playlists.map((playlist) => (
            <p
              key={playlist.id}
              onClick={() => setPlaylistId(playlist.id)}
              className={classNames(
                playlist.id === playlistId
                  ? "cursor-pointer hover:text-white text-white"
                  : "cursor-pointer hover:text-white",
                "cursor-pointer hover:text-white"
              )}
            >
              {playlist.name}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Sidebar;
