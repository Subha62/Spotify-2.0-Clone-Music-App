// import React from "react";
// import { useDispatch } from "react-redux";
// import { addSongInfo } from "../../reduxtool/slice/currentSongSlice";
// import "./SongsCard.css";

// const SongsCard = ({ songs }) => {
//   const dispatch = useDispatch();

//   const handleRedirect = (videoId) => {
//     dispatch(addSongInfo({ id: videoId, miniPlayerActive: false }));
//   };

//   return (
//     <div
//       className="songs-card-container cur-pointer"
//       onClick={() =>
//         handleRedirect(
//           songs.snippet.resourceId
//             ? songs.snippet.resourceId.videoId
//             : songs.id.videoId
//         )
//       }
//       title={songs.snippet.title.slice(0, 30) + "..."}
//     >
//       <div className="songs-card-wrapper">
//         <div className="songs-image-wrapper">
//           <img
//             src={
//               songs?.snippet.thumbnails?.maxres
//                 ? songs?.snippet.thumbnails?.maxres?.url
//                 : songs?.snippet.thumbnails?.high?.url
//             }
//             className="songs-image"
//             alt={songs.snippet.title + " (audio mp3)" || "song-poster"}
//           />
//           {/* visible only in search page */}
//           {songs.snippet?.liveBroadcastContent === "live" ? (
//             <small className="live-content">Live</small>
//           ) : null}
//         </div>
//         <div className="songs-title-channel-wrapper">
//           <p className="songs-title">{songs.snippet.title + " (audio mp3)"}</p>
//           {/* visible only in search page */}
//           <p className="songs-channel">
//             {songs?.snippet?.channelTitle === "YouTube"
//               ? "SB Music"
//               : songs?.snippet?.channelTitle}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SongsCard;


import React from "react";
import { useDispatch } from "react-redux";
import { addSongInfo } from "../../reduxtool/slice/currentSongSlice";
import "./SongsCard.css";

const SongsCard = ({ songs }) => {
  const dispatch = useDispatch();

  const handleRedirect = (videoId) => {
    // When user clicks: store selected song ID & ensure miniPlayer will open
    dispatch(addSongInfo({ id: videoId, miniPlayerActive: false }));
  };

  const videoId = songs?.snippet?.resourceId?.videoId || songs?.id?.videoId;

  return (
    <div
      className="songs-card-container cur-pointer"
      onClick={() => handleRedirect(videoId)}
      title={songs?.snippet?.title?.slice(0, 30) + "..."}
    >
      <div className="songs-card-wrapper">
        <div className="songs-image-wrapper">
          <img
            src={
              songs?.snippet?.thumbnails?.maxres
                ? songs.snippet.thumbnails.maxres.url
                : songs?.snippet?.thumbnails?.high?.url
            }
            className="songs-image"
            alt={`${songs?.snippet?.title} (audio mp3)` || "song-poster"}
          />
          {songs?.snippet?.liveBroadcastContent === "live" && (
            <small className="live-content">Live</small>
          )}
        </div>

        <div className="songs-title-channel-wrapper">
          <p className="songs-title">
            {songs?.snippet?.title || "Unknown Title"}
          </p>
          <p className="songs-channel">
            {songs?.snippet?.channelTitle === "YouTube"
              ? "SB Music"
              : songs?.snippet?.channelTitle || "Unknown Channel"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SongsCard;
