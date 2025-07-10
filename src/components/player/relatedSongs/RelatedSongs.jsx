import React, { useEffect, useRef, useState } from "react";
import { BsPlayCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addSongInfo } from "../../../reduxtool/slice/currentSongSlice";
import "./RelatedSongs.css";
import RelatedSongsSkeleton from "./RelatedSongsSkeleton";
import { useGetRelatedSongsQuery } from "../../../reduxtool/services/myApi";

const RelatedSongs = ({ songsList, setSongsList }) => {
  const dispatch = useDispatch();
  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { id } = currentSong;

  const [isUpClick, setIsUpClick] = useState(false);
  const upNextRef = useRef();

  //  Safe fetch
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRelatedSongsQuery(id, { skip: !id });

  //  Keep list fresh
  useEffect(() => {
    if (Array.isArray(data?.result) && data.result.length) {
      setSongsList(data.result);
    } else {
      setSongsList([]); // fallback clear if empty
    }
  }, [data, setSongsList]);

  //  Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (upNextRef.current && !upNextRef.current.contains(e.target)) {
        setIsUpClick(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  //  Play next
  const handleRedirect = (videoId) => {
    if (videoId) {
      dispatch(addSongInfo({ ...currentSong, id: videoId }));
    }
  };

  return (
    <div className="related-songs-section">
      <h3 className="relate-songs-heading">Up Next Songs</h3>
      <div
        className="relate-songs-heading mobile-next cur-pointer"
        ref={upNextRef}
        onClick={() => setIsUpClick(!isUpClick)}
      >
        Up Next Songs
      </div>

      <div
        className={`related-songs-container ${
          isUpClick ? "related-songs-mobile" : ""
        }`}
      >
        {isLoading ? (
          <RelatedSongsSkeleton amount={6} />
        ) : songsList?.length ? (
          songsList.map((song) => (
            <div
              className="related-songs-info-wrapper cur-pointer"
              key={song?.videoId || Math.random()}
              onClick={() => handleRedirect(song?.videoId)}
            >
              <div className="related-songs-image-wrapper">
                <img
                  src={song?.thumbnails || ""}
                  className="related-songs-image"
                  alt={song?.title || "Song Poster"}
                />
                {id === song?.videoId && (
                  <div className="playing-status-wrapper">
                    <BsPlayCircleFill
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                )}
                <small className="song-time-length">
                  {song?.length || "?"}
                </small>
              </div>
              <div className="related-songs-title-channel-wrapper">
                <p className="related-songs-title-wrapper">
                  {song?.title || "Unknown Title"}
                </p>
                <p className="related-songs-channel-wrapper">
                  • {song?.artistInfo?.artist?.[0]?.text || "Unknown Artist"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="related-songs-error-wrapper">
            <p className="sorry-emoji">😢</p>
            <p>Sorry! Not able to fetch related songs</p>

            {isError && (
              <p className="error-message">
                {typeof error?.data === "object"
                  ? JSON.stringify(error?.data, null, 2)
                  : String(error)}
              </p>
            )}

            <button
              type="button"
              className="cur-pointer refetch-button"
              onClick={refetch}
            >
              Refetch
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedSongs;

