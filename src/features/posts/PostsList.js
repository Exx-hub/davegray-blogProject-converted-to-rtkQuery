import PostsExcerpt from "./PostsExcerpt";
import { selectPostIds, useGetPostsQuery } from "./newPostSlice";
import { useSelector } from "react-redux";

const PostsList = () => {
  const { isError, isLoading, isSuccess, error } = useGetPostsQuery();

  const postIds = useSelector(selectPostIds);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = postIds.map((id) => <PostsExcerpt key={id} postId={id} />);
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
export default PostsList;
