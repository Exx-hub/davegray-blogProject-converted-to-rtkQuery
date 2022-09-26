import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../../app/api/apiSlice";

// entity adapter is where state is stored. ids and entities
// blank initial entity adapter
const postsAdapter = createEntityAdapter();

// added properties to entity adapter, add to ids array and entities object
const initialState = postsAdapter.getInitialState();

// inject endpoints add endpoints to apiSlice
export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        let min;
        const transformedData = responseData.map((item) => {
          if (!item?.date) {
            item.date = sub(new Date(), { minutes: min++ }).toISOString();
          }

          if (!item?.reactions) {
            item.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          }

          return item;
        });
        return postsAdapter.setAll(initialState, transformedData);
      },
      // basically refetch if any of the posts gets invalidated
      providesTags: (result, error, arg) => {
        return [
          { type: "Post", id: "LIST" },
          ...result.ids.map((id) => ({ type: "Post", id })),
        ];
      },
    }),
    getPostsByUserId: builder.query({
      query: (id) => `/posts?userId=${id}`,
      transformResponse: (responseData) => {
        let min = 1;
        const transformedData = responseData.map((item) => {
          if (!item?.date) {
            item.date = sub(new Date(), { minutes: min++ }).toISOString();
          }

          if (!item?.reactions) {
            item.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          }

          return item;
        });
        return postsAdapter.setAll(initialState, transformedData);
      },
      providesTags: (result, error, arg) => {
        console.log(result);
        return [...result.ids.map((id) => ({ type: "Post", id }))];
      },
    }),
    addPost: builder.mutation({
      query: (postContent) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...postContent,
          userId: Number(postContent.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (newContent) => ({
        url: `/posts/${newContent.id}`,
        method: "PUT",
        body: {
          ...newContent,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      // invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }], // not refetching? hmm
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: "LIST" }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          postsApiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.entities[postId];
            if (post) post.reactions = reactions;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = postsApiSlice;

// select fetched data from getPosts method
// returns the query result object --- doesnt issue the query
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

// but that is the entiure result object not just the data like below

// {status: 'fulfilled', endpointName: 'getPosts', requestId: '3X4dP3jcJJV_Mc2llRNUM', startedTimeStamp: 1664073272602, data: {…}, …}

// so we create a memoized selector and only return data property which contains the
// (normalized state object with ids and entities)

// selecPostdata --- accepts input function/s and its output function
// input function is selectpostData and output is taking the result and returning result.data

// memoized selector using above select fetched data,
// and returns entities and ids post slice of state, to use for creating selectors in getSelectors
const selectPostsData = createSelector(
  selectPostsResult,
  (result) => result.data // returns data fetch from entity adapter ids and entities
);

// now able to use these selectors to get all posts, get a post by id and get post ids
//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts, // select all items in entity object
  selectById: selectPostById, // pass  and id and selects item with that id
  selectIds: selectPostIds, // return ids array of entity adapter
  // Pass in a selector that returns the users slice of state
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState
);
