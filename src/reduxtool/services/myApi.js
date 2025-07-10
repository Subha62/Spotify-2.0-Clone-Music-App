// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

// export const myApi = createApi({
//   reducerPath: "myApi",
//   baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),

//   endpoints: (builder) => ({
//     getSongAudioUrls: builder.query({
//       query: (videoId) => ({
//         url: `song/${videoId}`,
//         method: "GET",
//       }),
//     }),
//     getRelatedSongs: builder.query({
//       query: (videoId) => ({
//         url: `related/${videoId}`,
//         method: "GET",
//       }),
//     }),
//     getMyplaylistInfo: builder.query({
//       query: () => ({
//         url: "localplaylistinfo",
//         method: "GET",
//       }),
//     }),
//   }),
// });

// export const {
//   useGetSongAudioUrlsQuery,
//   useGetMyplaylistInfoQuery,
//   useGetRelatedSongsQuery,
// } = myApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseYTUrl = "https://www.googleapis.com/youtube/v3";
const apiKey = import.meta.env.VITE_YT_API;

export const myApi = createApi({
  reducerPath: "myApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseYTUrl }),

  endpoints: (builder) => ({
    //  Related Songs (skip invalid ID)
    getRelatedSongs: builder.query({
      query: (videoId) => {
        if (!videoId) {
          console.warn(" No videoId given to getRelatedSongs");
          return { url: "/search", params: {} }; // won't fetch anything
        }
        return {
          url: "/search",
          params: {
            part: "snippet",
            relatedToVideoId: videoId,
            type: "video",
            maxResults: 10,
            key: apiKey,
          },
        };
      },
      transformResponse: (response) => ({
        result: Array.isArray(response?.items)
          ? response.items.map((item) => ({
              videoId: item?.id?.videoId || "",
              thumbnails: item?.snippet?.thumbnails?.medium?.url || "",
              title: item?.snippet?.title || "",
              length: "?", // YouTube search does not give duration
              artistInfo: {
                artist: [
                  {
                    text: item?.snippet?.channelTitle || "Unknown Artist",
                  },
                ],
              },
            }))
          : [],
      }),
    }),

    //  Single Video Info
    getSongsById: builder.query({
      query: (videoId) => {
        if (!videoId) {
          console.warn(" No videoId given to getSongsById");
          return { url: "/videos", params: {} }; // won't fetch
        }
        return {
          url: "/videos",
          params: {
            part: "snippet,contentDetails",
            id: videoId,
            key: apiKey,
          },
        };
      },
      transformResponse: (response) => ({
        items: Array.isArray(response?.items) ? response.items : [],
      }),
    }),
  }),
});

export const {
  useGetRelatedSongsQuery,
  useGetSongsByIdQuery,
} = myApi;
