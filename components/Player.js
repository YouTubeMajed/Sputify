import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { VolumeUpIcon } from "@heroicons/react/outline";
import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
  ReplyIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { recentlyPlayedTracks } from "../atoms/homePageAtom";
import {
  currentTrackIdState,
  isPlayingState,
  isReplayState,
  isShuffleState,
} from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [isShuffle, setIsShuffle] = useRecoilState(isShuffleState);
  const [isReplay, setIsReplay] = useRecoilState(isReplayState);
  const [isRecentlyPlayedTrack, setRecentlyPlayedTrack] =
    useRecoilState(recentlyPlayedTracks);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo(currentTrackId);

  const fetchCurrentSong = () => {
    if (spotifyApi.getAccessToken()) {
      if (!songInfo) {
        spotifyApi
          .getMyCurrentPlayingTrack()
          .then((data) => {
            setCurrentTrackId(data.body?.item?.id);
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
              setIsPlaying(data.body?.is_playing);
              setIsShuffle(data.body?.shuffle_state);
              spotifyApi
                .getMyRecentlyPlayedTracks({ limit: 4 })
                .then((data) => {
                  setRecentlyPlayedTrack(data.body);
                });
              if (data.body?.repeat_state !== "context")
                setIsReplay(data.body?.repeat_state);
            });
          })
          .catch((err) => console.log(err));
      }
    } else {
      signIn();
    }
  };

  const fetchCurrentSongTwo = () => {
    setTimeout(() => {
      if (spotifyApi.getAccessToken()) {
        spotifyApi
          .getMyCurrentPlayingTrack()
          .then((data) => {
            setCurrentTrackId(data.body?.item?.id);
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
              setIsPlaying(data.body?.is_playing);
              setIsShuffle(data.body?.shuffle_state);
              if (data.body?.repeat_state !== "context")
                setIsReplay(data.body?.repeat_state);
            });
          })
          .catch((err) => console.log(err));
      } else {
        signIn();
      }
    }, 600);
  };

  setInterval(function () {
    //this code runs every second
    fetchCurrentSongTwo();
  }, 120000);

  const handlePlayPause = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (!data.body?.device) return console.log("No Device");
        if (data.body?.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
          fetchCurrentSongTwo();
        } else {
          spotifyApi.play();
          setIsPlaying(true);
          fetchCurrentSongTwo();
        }
      })
      .catch((err) => console.log(err));
  };

  //

  const handleShuffleOnOff = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (!data.body?.device) return console.log("No Device");
        if (data.body?.shuffle_state) {
          spotifyApi.setShuffle("false");
          setIsShuffle(false);
          fetchCurrentSongTwo();
        } else {
          spotifyApi.setShuffle("true");
          setIsShuffle(true);
          fetchCurrentSongTwo();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleReplayOnOff = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (!data.body?.device) return console.log("No Device");
        if (data.body?.repeat_state == "track") {
          spotifyApi.setRepeat("off");
          setIsReplay(false);
          fetchCurrentSongTwo();
        } else {
          spotifyApi.setRepeat("track");
          setIsReplay(true);
          fetchCurrentSongTwo();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSkip = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (!data.body?.device) return console.log("No Device");
        if (data.body?.is_playing) {
          spotifyApi.skipToNext();
          fetchCurrentSongTwo(currentTrackId, spotifyApi, session);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleGoBack = () => {
    spotifyApi
      .getMyCurrentPlaybackState()
      .then((data) => {
        if (!data.body?.device) return console.log("No Device");
        if (data.body?.is_playing) {
          spotifyApi.skipToPrevious();
          fetchCurrentSongTwo(currentTrackId, spotifyApi, session);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
      fetchCurrentSongTwo();
    }, 300),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="h-24 bg-gradient-to-b from-gray-900 to-black text-white grid grid-cols-3 text-sm md:text-base px-2 md:px-8">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-12 w-12 rounded-md"
          src={songInfo?.album.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className="text-sm text-gray-500">
            {songInfo?.artists?.[0]?.name}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        {isShuffle ? (
          <SwitchHorizontalIcon
            onClick={handleShuffleOnOff}
            className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out text-[#0cbb2f]"
          />
        ) : (
          <SwitchHorizontalIcon
            onClick={handleShuffleOnOff}
            className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          />
        )}
        <RewindIcon
          onClick={handleGoBack}
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
        />
        {isPlaying ? (
          <PauseIcon
            className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out text-[#ffffff]"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayIcon
            className="w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
            onClick={handlePlayPause}
          />
        )}
        <FastForwardIcon
          onClick={handleSkip}
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
        />
        {isReplay ? (
          <ReplyIcon
            onClick={handleReplayOnOff}
            className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out text-[#0cbb2f]"
          />
        ) : (
          <ReplyIcon
            onClick={handleReplayOnOff}
            className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          />
        )}
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end p-5 hover:text-[#0cbb2f]">
        <VolumeDownIcon
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
          className="w-14 md:w-36 text-[#0cbb2f]"
        />
        <VolumeUpIcon
          className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
