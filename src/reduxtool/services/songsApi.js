import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const selectRandomKey = () => {
  const apiKey = import.meta.env.VITE_YT_API;
  if (apiKey.includes(",")) {
    const apiKeys = apiKey.split(",").map(k => k.trim());
    const random = Math.floor(Math.random() * apiKeys.length);
    return apiKeys[random];
  } else {
    return apiKey;
  }
};

const baseUrl = "https://www.googleapis.com/youtube/v3";

export const songsApi = createApi({
  reducerPath: "songsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),

  endpoints: (builder) => ({
    getSongsById: builder.query({
      query: (songId) => ({
        url: "videos",
        params: {
          part: "snippet,contentDetails",
          id: songId,
          key: selectRandomKey(),
        },
      }),
    }),

    getPlaylist: builder.query({
      query: (playlistId) => ({
        url: "playlists",
        params: {
          part: "snippet",
          id: playlistId,
          maxResults: 1,
          key: selectRandomKey(),
        },
      }),
    }),

    getPlaylistItems: builder.query({
      query: (playlistId) => ({
        url: "playlistItems",
        params: {
          part: "snippet",
          playlistId: playlistId,
          maxResults: 10,
          key: selectRandomKey(),
        },
      }),
    }),

    getAllPlaylistItems: builder.query({
      query: (playlistId) => ({
        url: "playlistItems",
        params: {
          part: "snippet",
          playlistId: playlistId,
          maxResults: 50,
          key: selectRandomKey(),
        },
      }),
    }),

    getSearchItems: builder.query({
      query: (searchQuery) => ({
        url: "search",
        params: {
          part: "snippet",
          q: searchQuery,
          type: "video",
          maxResults: 50,
          key: selectRandomKey(),
        },
      }),
    }),

    getSearchRelatedItems: builder.query({
      query: (videoId) => ({
        url: "search",
        params: {
          part: "snippet",
          relatedToVideoId: videoId,
          type: "video",
          videoCategoryId: "10",
          maxResults: 10,
          key: selectRandomKey(),
        },
      }),
    }),
  }),
});

export const {
  useGetPlaylistItemsQuery,
  useGetSongsByIdQuery,
  useGetSearchItemsQuery,
  useGetSearchRelatedItemsQuery,
  useGetAllPlaylistItemsQuery,
  useGetPlaylistQuery,
} = songsApi;

