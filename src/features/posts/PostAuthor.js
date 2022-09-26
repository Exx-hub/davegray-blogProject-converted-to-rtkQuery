import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUserById } from "../users/usersSlice";

const PostAuthor = ({ userId }) => {
  const author = useSelector((state) => selectUserById(state, userId));

  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};
export default PostAuthor;
