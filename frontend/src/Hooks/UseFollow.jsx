import {useMutation, useQueryClient} from "@tanstack/react-query";
const useFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: followUser, isLoading } = useMutation({
    mutationkey: ["follow"],
    mutationFn: async (userId) => {
      try { 
        const response = await fetch(`/api/user/follow/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to follow user");
        }
        return data;

      }
      catch (error) {
        throw new Error(error)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({	queryKey: ['followerSuggestions']})
    }
  })

  return { followUser, isLoading }
}

export default useFollow;