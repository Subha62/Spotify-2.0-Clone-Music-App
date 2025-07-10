import React from "react";
import ReactPlayer from "react-player";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { BsFullscreen } from "react-icons/bs";

import "./CustomPlayer.css";

const CustomPlayer = ({
  songId,
  playerRef,
  songsInfo,
  isLoading,
  activeToggle,
  playerState,
  setPlayerState,
  setAudioLoading,
  autoPlay,
  handleNext,
  setAlertMessage,
  setIsReady,
}) => {
  const handleFullscreenToggle = () => {
    const wrapper = playerRef?.current?.wrapper;
    if (!wrapper) {
      setAlertMessage?.("Player not ready for fullscreen.");
      return;
    }

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch((err) => {
        console.error(`Fullscreen error: ${err.message}`);
        setAlertMessage?.("Unable to enable fullscreen mode.");
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Exit fullscreen error: ${err.message}`);
        setAlertMessage?.("Unable to exit fullscreen mode.");
      });
    }
  };

  const posterUrl = songsInfo[0]?.snippet?.thumbnails?.maxres
    ? `https://i.ytimg.com/vi/${songId}/maxresdefault.jpg`
    : `https://i.ytimg.com/vi/${songId}/hqdefault.jpg`;

  const isAudioMode = activeToggle === "audio";
  const reactPlayerUrl = isAudioMode && playerState.url
    ? playerState.url
    : `https://www.youtube.com/watch?v=${songId}`;

  return (
    <div
      className={`player-song-image-wrapper ${
        !songsInfo[0]?.snippet?.thumbnails?.maxres ? "small-hq-image" : ""
      }`}
    >
      {!isLoading && songsInfo.length ? (
        <img
          src={posterUrl}
          alt="Song Poster"
          className="player-song-image"
        />
      ) : (
        <SkeletonTheme baseColor="#747070" highlightColor="#615e5e">
          <Skeleton height="200px" />
        </SkeletonTheme>
      )}

      <ReactPlayer
        ref={playerRef}
        url={reactPlayerUrl}
        playing={playerState.playing}
        volume={playerState.volume}
        controls={!isAudioMode}
        onReady={() => {
          setAudioLoading?.(false);
          setIsReady?.(true);
        }}
        onPlay={() =>
          setPlayerState?.((prev) => ({ ...prev, playing: true }))
        }
        onPause={() =>
          setPlayerState?.((prev) => ({ ...prev, playing: false }))
        }
        onProgress={({ played, loaded }) =>
          setPlayerState?.((prev) => ({ ...prev, played, loaded }))
        }
        onEnded={() => {
          if (autoPlay) handleNext?.();
        }}
        onError={(e) => {
          console.error("ReactPlayer error:", e);
          setPlayerState?.((prev) => ({ ...prev, url: null }));
          if (isAudioMode) {
            setAlertMessage?.("Audio error — try reloading or switch to Video.");
          }
        }}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          transform: "scale(1.01)",
        }}
      />

      {activeToggle === "video" && (
        <button
          type="button"
          title="Toggle Fullscreen"
          className="fullscreen-btn absolute-center"
          onClick={handleFullscreenToggle}
        >
          <BsFullscreen size={18} />
        </button>
      )}
    </div>
  );
};

export default CustomPlayer;

