import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import { useEffect } from "react";
const Posts = ({ feedType, username }) => {
  
  const apiEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/post";
      case "following":
        return "/api/post/followerpost";
      case "posts":
        return `/api/post/getpost/${username}`;
      default:
        return "/api/post";
    }
  }

  const endpoint = apiEndpoint();
  const {data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch posts");
        }
        return data?.post || [];
       }
      catch (error) {
        throw new Error(error)

      }
    }
  })

  
  
  useEffect(() => {
    refetch();

  }, [feedType]);

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
				</div>
			)}
			{!isLoading && data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && data && (
				<div>
					{data.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;