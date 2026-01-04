import { Link } from "react-router-dom";
import RightSideSkeletons from "../Skeletons/RightSideSkeletons";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../Hooks/UseFollow";

const RightPanel = () => {
	const { followUser} = useFollow();
	const { data:USERS_FOR_RIGHT_PANEL, isLoading } = useQuery({
		queryKey: ['followerSuggestions'],
		queryFn: async () => {
			try { 
				const response = await fetch('/api/user');
				const data = await response.json();
				return data;
			}
			catch (error) {
				throw new Error(error)
			}
		}
	})
	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightSideSkeletons />
							<RightSideSkeletons />
							<RightSideSkeletons />
							<RightSideSkeletons />
						</>
					)}
					{!isLoading &&
						USERS_FOR_RIGHT_PANEL?.map((user) => (
							<Link
								to={`/profile/${user?.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
												e.preventDefault()
											followUser(user._id);
										
										}}
									>
										Follow
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel