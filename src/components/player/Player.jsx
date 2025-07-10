import React, { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useGetSongsByIdQuery } from "../../reduxtool/services/songsApi";
import { addSongInfo } from "../../reduxtool/slice/currentSongSlice";
import { useLocation } from "react-router-dom";

import RelatedSongs from "./relatedSongs/RelatedSongs";
import PlayerControls from "./playerControls/PlayerControls";
import PlayerMoreInfo from "./playerMoreInfo/PlayerMoreInfo";
import SongDetailsModel from "./songDetailsModel/SongDetailsModel";
import CustomPlayer from "./customPlayer/CustomPlayer";
import MiniPlayer from "./miniPlayer/MiniPlayer";
import Toggle from "../toggle/Toggle";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import "./Player.css";

const Player = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { id = "", miniPlayerActive } = currentSong;

  const { data, isLoading } = useGetSongsByIdQuery(id, { skip: !id });
  const reactPlayerRef = useRef();

  const [songsInfo, setSongsInfo] = useState([]);
  const [songsList, setSongsList] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [autoPlay, setAutoPlay] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [activeToggle, setActiveToggle] = useState("audio");
  const [audioFormat, setAudioFormat] = useState(localStorage.getItem("audioQuality") ?? "high");

  const [playerState, setPlayerState] = useState({
    url: null,
    playing: false,
    volume: parseFloat(localStorage.getItem("localVolume")) || 1.0,
    muted: false,
    played: 0,
    loaded: 0,
  });

  const [playerInfo, setPlayerInfo] = useState({
    isMoreInfoClick: false,
    isAudioQualityClick: false,
    isSongDetailsClick: false,
  });

  const toggleList = [
    { name: "Audio", value: "audio" },
    { name: "Video", value: "video" },
  ];

  // Dummy: Simulate getting audio URLs
  const getSongAudioUrls = (videoId) => {
    if (videoId?.startsWith("okv")) {
      return {
        audioFormatHigh: `https://yourcdn.com/audio/${videoId}_high.mp3`,
        audioFormatLow: `https://yourcdn.com/audio/${videoId}_low.mp3`,
      };
    }
    return { audioFormatHigh: null, audioFormatLow: null };
  };

  // Fetch audio URL when ID or format changes
  useEffect(() => {
    if (activeToggle === "audio" && id) {
      setAudioLoading(true);
      const urls = getSongAudioUrls(id);
      const url = audioFormat === "high" ? urls.audioFormatHigh : urls.audioFormatLow;

      if (!url) {
        setAlertMessage("No direct audio found. Falling back to video audio.");
        setPlayerState((prev) => ({ ...prev, url: null }));
      } else {
        setPlayerState((prev) => ({ ...prev, url }));
        setAlertMessage("");
      }

      setAutoPlay(true);
      setAudioLoading(false);
    }
  }, [id, audioFormat, activeToggle]);

  // Update songs info
  useEffect(() => {
    if (data?.items?.length) {
      setSongsInfo(data.items);
    }
  }, [data]);

  // Live stream warning
  useEffect(() => {
    if (songsInfo[0]?.snippet?.liveBroadcastContent === "live") {
      setAlertMessage("Live streams can't play as audio.");
    }
  }, [songsInfo]);

  // LocalStorage: Save current song
  useEffect(() => {
    localStorage.setItem("currentSongInfo", JSON.stringify(currentSong));
  }, [currentSong]);

  // Disable scroll when player open
  useEffect(() => {
    document.body.style.overflowY = miniPlayerActive ? "auto" : "hidden";
  }, [miniPlayerActive]);

  // MediaSession API
  const videoIds = songsList.map((s) => s.videoId) || [];
  const currentIndex = videoIds.findIndex((vid) => vid === id);

  useEffect(() => {
    if ("mediaSession" in navigator && songsInfo[0]) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: songsInfo[0]?.snippet?.title,
        album: songsInfo[0]?.snippet?.channelTitle,
        artwork: [
          { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, sizes: "96x96", type: "image/png" },
          { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, sizes: "512x512", type: "image/png" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () =>
        setPlayerState((prev) => ({ ...prev, playing: true }))
      );
      navigator.mediaSession.setActionHandler("pause", () =>
        setPlayerState((prev) => ({ ...prev, playing: false }))
      );
      navigator.mediaSession.setActionHandler("previoustrack", currentIndex > 0 ? handlePrev : null);
      navigator.mediaSession.setActionHandler("nexttrack", currentIndex < videoIds.length - 1 ? handleNext : null);
    }
  }, [id, songsInfo, currentIndex, videoIds.length]);

  // Back navigation: auto-enable mini player
  useEffect(() => {
    const handlePopState = () => {
      if (!miniPlayerActive) {
        dispatch(addSongInfo({ ...currentSong, miniPlayerActive: true }));
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.pathname, miniPlayerActive, dispatch, currentSong]);

  // Reset state when ID changes
  useEffect(() => {
    setPlayerState((prev) => ({ ...prev, url: null, loaded: 0, played: 0, playing: false }));
    setAlertMessage("");
    setIsReady(false);
  }, [id, activeToggle]);

  // Auto play when ready
  useEffect(() => {
    setPlayerState((prev) => ({
      ...prev,
      playing: audioLoading ? false : autoPlay && isReady,
    }));
  }, [audioLoading, autoPlay, isReady]);

  const handleNext = () => {
    if (currentIndex < videoIds.length - 1) {
      dispatch(addSongInfo({ ...currentSong, id: videoIds[currentIndex + 1] }));
      setAutoPlay(true);
    } else {
      setAlertMessage("End of track list.");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      dispatch(addSongInfo({ ...currentSong, id: videoIds[currentIndex - 1] }));
    } else {
      setAlertMessage("Start of track list.");
    }
  };

  return (
    <div className={`player-section ${miniPlayerActive ? "miniplayer-active" : ""}`}>
      <div className="bg-poster-wrapper">
        <img
          className="bg-poster-image"
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt="poster"
        />
      </div>

      {!miniPlayerActive && (
        <div className="top-player-controll-wrapper container">
          <button
            type="button"
            title="minimize"
            className="player-minimize-wrapper cur-pointer"
            onClick={() =>
              dispatch(addSongInfo({ ...currentSong, miniPlayerActive: true }))
            }
          >
            <BsChevronDown />
          </button>
          <PlayerMoreInfo
            id={id}
            audioUrl={playerState.url}
            playerInfo={playerInfo}
            setPlayerInfo={setPlayerInfo}
            audioFormat={audioFormat}
            setAudioFormat={setAudioFormat}
            setAlertMessage={setAlertMessage}
          />
        </div>
      )}

      <SongDetailsModel
        id={id}
        playerInfo={playerInfo}
        setPlayerInfo={setPlayerInfo}
        audioUrl={playerState.url}
        songsInfo={songsInfo}
      />

      <div className={`main-player container ${miniPlayerActive ? "hide-main-player" : ""}`}>
        <div className="player-container">
          <Toggle toggleList={toggleList} activeToggle={activeToggle} setActiveToggle={setActiveToggle} />

          <div className="player-container-inner">
            <CustomPlayer
              songId={id}
              playerRef={reactPlayerRef}
              songsInfo={songsInfo}
              setAudioLoading={setAudioLoading}
              playerState={playerState}
              setPlayerState={setPlayerState}
              handleNext={handleNext}
              activeToggle={activeToggle}
              isLoading={isLoading}
              autoPlay={autoPlay}
              setAlertMessage={setAlertMessage}
              setIsReady={setIsReady}
            />

            {!isLoading && songsInfo.length ? (
              <div className="player-song-title-channel-wrapper absolute-center">
                <p className="player-song-title">{songsInfo[0]?.snippet?.title}</p>
                <p className="player-song-channel">• {songsInfo[0]?.snippet?.channelTitle}</p>
              </div>
            ) : (
              <SkeletonTheme baseColor="#747070" highlightColor="#615e5e">
                <Skeleton width={"250px"} />
              </SkeletonTheme>
            )}

            <PlayerControls
              playerRef={reactPlayerRef}
              audioLoading={audioLoading}
              songsList={songsList}
              playerState={playerState}
              setPlayerState={setPlayerState}
              handleNext={handleNext}
              handlePrev={handlePrev}
              autoPlay={autoPlay}
              setAutoPlay={setAutoPlay}
              currentIndex={currentIndex}
              mapVideoId={videoIds}
            />
          </div>

          {alertMessage && (
            <div className="alert-message-wrapper">
              <div className="alert-message">
                <small>{alertMessage}</small>
                <button type="button" onClick={() => setAlertMessage("")}>
                  <RxCross2 size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        <RelatedSongs songsList={songsList} setSongsList={setSongsList} />
      </div>

      {miniPlayerActive && (
        <MiniPlayer
          songsInfo={songsInfo}
          videoId={id}
          playerState={playerState}
          setPlayerState={setPlayerState}
          handleNext={handleNext}
          handlePrev={handlePrev}
          audioLoading={audioLoading}
          playerRef={reactPlayerRef}
          songsList={songsList}
          mapVideoId={videoIds}
          currentIndex={currentIndex}
        />
      )}
    </div>
  );
};

export default Player;
