import React, { useEffect, useState } from "react";
import "./PlayerControls.css";
import {
  BsFillSkipEndFill,
  BsFillSkipStartFill,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsPauseCircleFill,
  BsPlayCircleFill,
} from "react-icons/bs";

const PlayerControls = ({
  playerRef,
  audioLoading,
  handleNext,
  handlePrev,
  playerState,
  setPlayerState,
  autoPlay,
  setAutoPlay,
  mapVideoId = [],
  currentIndex = 0,
}) => {
  const [seekTime, setSeekTime] = useState(0);
  const [bufferedAmount, setBufferedAmount] = useState(0);

  const duration = playerRef?.current?.getDuration?.() || 0;
  const currentTime = (playerState?.played ?? 0) * duration;

  useEffect(() => {
    if (duration > 0 && seekTime >= 0) {
      const fraction = seekTime / duration;
      playerRef?.current?.seekTo(fraction, "fraction");
    }
  }, [seekTime, duration, playerRef]);

  useEffect(() => {
    setBufferedAmount(Math.floor((playerState?.loaded ?? 0) * 100));
  }, [playerState?.loaded]);

  // Persist volume
  useEffect(() => {
    localStorage.setItem("localVolume", playerState.volume);
  }, [playerState.volume]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00";
    return seconds > 3600
      ? new Date(seconds * 1000).toISOString().substr(11, 8)
      : new Date(seconds * 1000).toISOString().substr(14, 5);
  };

  return (
    <div className="player-controls-container">
      <div className="progress-duration-wrapper">
        <div className="player-progress-bar-wrapper cur-pointer">
          <input
            type="range"
            title="Seekbar"
            className="seekbar"
            step="any"
            min={0}
            max={duration}
            value={currentTime}
            onInput={(e) => setSeekTime(Number(e.target.value))}
            style={{
              "--buffered-width": `${bufferedAmount}%`,
            }}
          />
        </div>
        <div className="player-durations-wrapper">
          <p>{formatTime(currentTime)}</p>
          <p>{formatTime(duration)}</p>
        </div>
      </div>

      <div className="player-controls-wrapper absolute-center">
        <button
          type="button"
          title="Previous"
          className="audio-prev-wrapper next-prev-icons cur-pointer"
          disabled={currentIndex <= 0}
          style={{ opacity: currentIndex <= 0 ? 0.5 : 1 }}
          onClick={handlePrev}
        >
          <BsFillSkipStartFill style={{ width: "100%", height: "100%" }} />
        </button>

        <div className="audio-play-pause-wrapper">
          <button
            type="button"
            title={playerState.playing ? "Pause" : "Play"}
            className="audio-play-pause cur-pointer"
            onClick={() =>
              setPlayerState((prev) => ({ ...prev, playing: !prev.playing }))
            }
          >
            {!playerState.playing || playerState.played === 1 ? (
              <BsPlayCircleFill
                style={{
                  width: "100%",
                  height: "100%",
                  opacity: audioLoading ? 0.8 : 1,
                }}
              />
            ) : (
              <BsPauseCircleFill style={{ width: "100%", height: "100%" }} />
            )}
          </button>

          {audioLoading && (
            <div className="loading-spin">
              <svg style={{ width: "100%", height: "100%" }}>
                <circle
                  cx="35"
                  cy="35"
                  r="30"
                  fill="transparent"
                  className="svg-circle"
                ></circle>
              </svg>
            </div>
          )}
        </div>

        <button
          type="button"
          title="Next"
          className="audio-next-wrapper next-prev-icons cur-pointer"
          disabled={currentIndex >= mapVideoId.length - 1}
          style={{
            opacity: currentIndex >= mapVideoId.length - 1 ? 0.5 : 1,
          }}
          onClick={handleNext}
        >
          <BsFillSkipEndFill style={{ width: "100%", height: "100%" }} />
        </button>
      </div>

      <div className="volume-autoplay-wrapper">
        <div className="audio-volume-wrapper">
          <button
            type="button"
            title={playerState.volume > 0 ? "Mute" : "Unmute"}
            className="audio-volume-btn"
            onClick={() =>
              setPlayerState((prev) => ({
                ...prev,
                volume: prev.volume > 0 ? 0 : 0.5,
              }))
            }
          >
            {playerState.volume > 0 ? (
              <BsFillVolumeUpFill style={{ width: "100%", height: "100%" }} />
            ) : (
              <BsFillVolumeMuteFill style={{ width: "100%", height: "100%" }} />
            )}
          </button>

          <div className="audio-volume">
            <input
              type="range"
              title="Volume"
              className="volume-input cur-pointer"
              min={0.0}
              max={1.0}
              step={0.01}
              value={playerState.volume}
              onChange={(e) =>
                setPlayerState((prev) => ({
                  ...prev,
                  volume: e.target.valueAsNumber,
                }))
              }
            />
          </div>
        </div>

        <div className="audio-autoplay-wrapper">
          <div className="audio-autoplay-title">AutoPlay</div>
          <label className="audio-autoplay">
            <input
              type="checkbox"
              title="Autoplay"
              checked={autoPlay}
              onChange={() => setAutoPlay((prev) => !prev)}
            />
            <span className="autoplay-slider" title="Autoplay">
              <span className="autoplay-icons">
                {autoPlay ? (
                  <BsPlayCircleFill style={{ width: "100%", height: "100%" }} />
                ) : (
                  <BsPauseCircleFill
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
