import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import { shuffle } from "lodash";
import ClipLoader from "react-spinners/SyncLoader";
import RecentlyPlayedSongs from "./RecentlyPlayedSongs";

function HomeCenter() {
  const colours = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
  ];
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [colour, setColour] = useState(null);
  const [loading, setLoading] = useRecoilState(isLoadingState);

  useEffect(() => {
    setColour(shuffle(colours).pop());
  }, []);

  // useEffect(() => {
  //   spotifyApi
  //     .getMyRecentlyPlayedTracks()
  //     .then((data) => {
  //       console.log(data.body);
  //     })
  //     .catch((err) => console.log(err));
  // }, [spotifyApi]);

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
              className={`flex space-x-7 bg-gradient-to-b to-black ${colour} h-80 text-white p-12 rounded-sm`}
            >
              <h1 className="text-xl md:text-3xl lg:text-3xl sm:text-3xl font-bold">
                Good morning, {session.user.name}
              </h1>
            </section>
            <h2 className="flex font-bold justify-center items-center">
              Recently Played
            </h2>
            <RecentlyPlayedSongs />
          </>
        )}
      </div>
    </div>
  );
}

export default HomeCenter;
