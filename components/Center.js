import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoadingState,
  playlistIdState,
  playlistState,
} from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import ClipLoader from "react-spinners/SyncLoader";

const colours = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [colour, setColour] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [loading, setLoading] = useRecoilState(isLoadingState);

  useEffect(() => {
    setColour(shuffle(colours).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log(err));
  }, [spotifyApi, playlistId]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide text-white col-span-full">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center space-x-3 opacity-80 hover:opacity-100 cursor-pointer rounded-full p-1 pr-2 bg-zinc-900"
          onClick={() => signOut()}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user?.image}
            alt={session?.user?.name}
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <div>
        {loading ? (
          <>
            <div className="flex justify-center items-center w-[100%] h-[100vh]">
              <ClipLoader color="#FFFFFF" loading={loading} size={70} />
            </div>
          </>
        ) : (
          <>
            <section
              className={`flex items-end space-x-7 bg-gradient-to-b to-black ${colour} h-80 text-white p-12 rounded-sm`}
            >
              <img
                className="h-44 w-44 shadow-2xl rounded-md"
                src={playlist?.images?.[0]?.url}
                alt={playlist?.name}
              />
              <div>
                <p>PLAYLIST</p>
                <h2 className="text-2xl md:text-3xl xl:text-5xl font-bold">
                  {playlist?.name}
                </h2>
              </div>
            </section>
            <Songs />
          </>
        )}
      </div>
    </div>
  );
}

export default Center;
