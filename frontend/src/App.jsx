import RightPanel from "./components/commans/RightPanel"
import Sidebar from "./components/commans/Sidebar"
import LoginPage from "./Pages/Auth/LoginPage"
import SignUpPage from "./Pages/Auth/SignUpPage"
import Homepages from "./Pages/Home/Homepages"

import { Navigate, Route, Routes } from "react-router-dom"
import NotificationPage from "./Pages/Home/Notification/NotificationPage"
import ProfilePage from "./Pages/Home/Profile/ProfilePage"
import { useQuery, useQueryClient } from "@tanstack/react-query"
function App() {
  const queryclient = useQueryClient();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try { 
        const response = await fetch("/api/auth/me");
        if(response.error) return null;
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch auth user");
        }
        return data;
      }

      catch (error) {
        throw new Error(error)
      }
    },
    retry: false,
    });
  
    


  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && 
        <Sidebar />
      }
      <Routes>  
        <Route path="/" element={authUser ? <Homepages /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={! authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
         <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    
    {authUser && <RightPanel />}
    </div>
  )
}

export default App
