import React, { useState } from "react";
import {
  BsFillSkipEndFill,
  BsFillSkipStartFill,
  BsPauseCircleFill,
  BsPlayCircleFill,
} from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  addSongInfo,
  clearSongInfo,
} from "../../../reduxtool/slice/currentSongSlice";
import "./MiniPlayer.css";
import "../playerControls/PlayerControls.css";

const MiniPlayer = ({
  songsInfo,
  playerState,
  setPlayerState,
  handleNext,
  handlePrev,
  audioLoading,
  mapVideoId,
  currentIndex,
}) => {
  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { id } = currentSong;
  const dispatch = useDispatch();

  const [playerClose, setPlayerClose] = useState(false);

  const handleClosePlayer = () => {
    // Stop playback
    setPlayerState((prev) => ({ ...prev, playing: false }));
    // Mark mini player closed (local state)
    setPlayerClose(true);
    // Fully clear Redux state and localStorage
    dispatch(clearSongInfo());
  };

  const isPrevDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex >= mapVideoId.length - 1;

  // Hide MiniPlayer if closed or no active song
  if (playerClose || !id) return null;

  return (
    <div className="mini-player-section">
      <div className="mini-player-container container">
        <div
          className="mini-player-song-info-wrapper cur-pointer"
          onClick={() =>
            dispatch(addSongInfo({ ...currentSong, miniPlayerActive: false }))
          }
        >
          <div className="mini-player-image-wrapper">
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              className="mini-player-image"
              alt="mini-player-poster"
            />
          </div>
          <div className="mini-player-song-title-channel-wrapper absolute-center">
            <div className="mini-player-song-title">
              {songsInfo[0]?.snippet?.title || "Unknown Title"}
            </div>
            <div className="mini-player-song-channel">
              • {songsInfo[0]?.snippet?.channelTitle || "Unknown Channel"}
            </div>
          </div>
        </div>

        <div className="audio-controls-wrapper absolute-center">
          <button
            type="button"
            className="audio-prev-wrapper next-prev-icons cur-pointer"
            style={{ opacity: isPrevDisabled ? 0.5 : 1 }}
            onClick={() => !isPrevDisabled && handlePrev()}
            disabled={isPrevDisabled}
          >
            <BsFillSkipStartFill />
          </button>

          <div className="audio-play-pause-wrapper">
            <button
              type="button"
              className="audio-play-pause cur-pointer"
              onClick={() =>
                setPlayerState((prev) => ({
                  ...prev,
                  playing: !prev.playing,
                }))
              }
            >
              {!playerState.playing || playerState.played === 1 ? (
                <BsPlayCircleFill
                  style={{
                    opacity: audioLoading ? 0.8 : 1,
                  }}
                />
              ) : (
                <BsPauseCircleFill />
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
                  />
                </svg>
              </div>
            )}
          </div>

          <button
            type="button"
            className="audio-next-wrapper next-prev-icons cur-pointer"
            style={{ opacity: isNextDisabled ? 0.5 : 1 }}
            onClick={() => !isNextDisabled && handleNext()}
            disabled={isNextDisabled}
          >
            <BsFillSkipEndFill />
          </button>
        </div>

        <button
          type="button"
          className="player-close-wrapper cur-pointer"
          onClick={handleClosePlayer}
        >
          <RxCross2 />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
