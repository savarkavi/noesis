import { getPosts } from "@/app/(main)/actions/postActions";
import Post from "./Post";

const Feeds = async () => {
  const { posts } = await getPosts();

  return <div>{posts?.map((post) => <Post key={post.id} post={post} />)}</div>;
};

export default Feeds;
