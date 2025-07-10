// import React, { useEffect } from "react";
// import "./Home.css";
// import SongsList from "../../components/songsList/SongsList";

// import { homepagePlaylistInfo } from "../../utils/homepagePlaylists";

// const Home = () => {
//   useEffect(() => {
//     document.title = "Enjoy Your Top Trending Songs • SB Music";
//   }, []);

//   return (
//     <div className="home-section">
//       {homepagePlaylistInfo.map((playlist) => (
//         <SongsList
//           key={playlist.id}
//           playlistId={playlist.id}
//           title={playlist.title}
//         />
//       ))}
//     </div>
//   );
// };

// export default Home;


import React, { useEffect } from "react";
import "./Home.css";
import SongsList from "../../components/songsList/SongsList";
import { homepagePlaylistInfo } from "../../utils/homepagePlaylists";
import { useSelector } from "react-redux";

const Home = () => {
  const currentSong = useSelector((state) => state.currentSongSlice.currentSongInfo);

  useEffect(() => {
    document.title = "Enjoy Your Top Trending Songs • SB Music";
  }, []);

  const hasActiveSong = !!currentSong?.id;

  return (
    <div className={`home-section ${hasActiveSong ? "with-song-bg" : ""}`}>
      {homepagePlaylistInfo.map((playlist) => (
        <SongsList
          key={playlist.id}
          playlistId={playlist.id}
          title={playlist.title}
        />
      ))}
    </div>
  );
};

export default Home;
