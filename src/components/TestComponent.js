import React from "react";
import { useSelector } from "react-redux";
import {
  selectPostById,
  selectPostIds,
  selectUsersResult,
  useGetPostsQuery,
  selectAllPosts,
  useAddPostMutation,
  useGetPostsByUserIdQuery,
} from "../features/posts/newPostSlice";
import {
  selectAllUsers,
  selectUserById,
  selectUserIds,
} from "../features/users/usersSlice";

function TestComponent() {
  // const postsByUserId = useGetPostsByUserIdQuery(1);
  // console.log(postsByUserId);

  const users = useSelector(selectAllUsers);
  const userIds = useSelector(selectUserIds);
  const userById = useSelector((state) => selectUserById(state, 2));

  console.log(userById);

  // const postIds = useSelector(selectPostIds);
  // console.log({ allPosts, postById, postIds });

  // const [addTodo] = useAddPostMutation();

  // const handleAddPost = () => {
  //   addTodo({ userId: 1, id: 2000, title: "123", body: "t123" });
  // };

  return (
    <>
      <div>{JSON.stringify(users)}</div>
      <div>{JSON.stringify(userIds)}</div>
    </>
  );
}

export default TestComponent;
