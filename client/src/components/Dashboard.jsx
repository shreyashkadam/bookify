import React from "react";
import { IoHome } from "react-icons/io5";
import { NavLink, Route, Routes } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import DashboardHome from "./DashboardHome";
import DashboardAudiobooks from "./DashboardAudiobooks";
import DashboardAuthors from "./DashboardAuthors";
import DashboardSeries from "./DashboardSeries";
import DashboardUsers from "./DashboardUsers";
import DashboardNewAudiobook from "./DashboardNewAudiobook";
import Header from "./Header";

const Dashboard = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="w-[60%] my-2 p-4 flex items-center justify-evenly">
        <NavLink to={"/dashboard/home"}><IoHome className="text-2xl text-textColor" /></NavLink>
        <NavLink to={"/dashboard/users"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}> Users </NavLink>
        <NavLink to={"/dashboard/audiobooks"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}> Audiobooks </NavLink>
        <NavLink to={"/dashboard/authors"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}> Authors </NavLink>
        <NavLink to={"/dashboard/series"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}> Series </NavLink>
      </div>
      <div className="my-4 w-full p-4">
        <Routes>
          <Route path="/home" element={<DashboardHome />} />
          <Route path="/users" element={<DashboardUsers />} />
          <Route path="/audiobooks" element={<DashboardAudiobooks />} />
          <Route path="/authors" element={<DashboardAuthors />} />
          <Route path="/series" element={<DashboardSeries />} />
          <Route path="/newAudiobook" element={<DashboardNewAudiobook />} />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard