import React from "react";
import "./ExploreList.css";
import ExploreCard from "../exploreCard/ExploreCard";
import ExploreCardSkeleton from "../exploreCard/ExploreCardSkeleton";
import { useGetPlaylistQuery } from "../../reduxtool/services/songsApi";

const ExploreList = ({ playlistId }) => {
  const { data, isLoading } = useGetPlaylistQuery(playlistId);

  return (
    <div className="explore-list-container">
      <div className="explore-card-list">
        {!isLoading && data?.items?.length ? (
          data.items.map((item) => (
            <ExploreCard
              key={item.id}
              playlistId={item.id}
              title={item.snippet.title}
              poster={item.snippet.thumbnails?.standard?.url}
              description={item.snippet.description}
            />
          ))
        ) : (
          <ExploreCardSkeleton amount={5} />
        )}
      </div>
    </div>
  );
};

export default ExploreList;
