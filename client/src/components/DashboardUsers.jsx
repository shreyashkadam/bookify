import React, { useEffect, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { motion } from "framer-motion";
import { getAllUsers } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import { DashboardCard } from "./DashboardHome";
import moment from "moment";

const DashboardUsers = () => {

  const [{ allUsers }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data.data,
        });
      });
    }
  }, []);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="relative w-full py-12 min-h-[400px] overflow-x-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 my-4 flex flex-col items-center justify-start p-4 border border-gray-300 rounded-md gap-3">
        <div className="absolute top-4 left-4">
          <p className="text-sm font-semibold">
            Count : <span className="text-xl font-bold text-textColor">
              {allUsers?.length}
            </span>
          </p>
        </div>

        <div className="w-full min-w-[750px] flex items-center justify-between">
          <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Image</p>
          <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Name</p>
          <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Email</p>
          <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Verified</p>
          <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Created</p>
          <p className="text-sm text-textColor font-semibold w-275 min-w-[160px] text-center">Role</p>
        </div>

        {
          allUsers && (
            allUsers?.map((data, i) => (
              <DashboardUserCard data={data} index={i} />
            ))
          )
        }

      </div>
    </div>
  )
}

export const DashboardUserCard = ({ data, index }) => {

  const createdAt = moment(new Date(data.createdAt)).format("MMMM Do YYYY");
  const [{ user }, dispatch] = useStateValue();

  return (
    <motion.div
      className="relative w-full rounded-md flex items-center justify-between py-4 bg-lightOverlay cursor-pointer hover:bg-card hover:shadow-md"
    >
      <div className="w-275 min-w-[160px] flex items-center justify-center">
        <img src={data.imageURL} referrerPolicy="no-referrer" alt="" className="w-10 h-10 object-cover rounded-md min-w-[40px] shadow-md"
        />
      </div>
      <p className="text-base text-textColor w-275 min-w-[160px] text-center">{data.name}</p>
      <p className="text-base text-textColor w-275 min-w-[160px] text-center">{data.email}</p>
      <p className="text-base text-textColor w-275 min-w-[160px] text-center">{data.email_verfied ? 'True' : 'False'}</p>
      <p className="text-base text-textColor w-275 min-w-[160px] text-center">{createdAt}</p>
      <div className=" w-275 min-w-[160px] text-center flex items-center justify-center gap-6 relative">
        <p className="text-base text-textColor"> {data.role}</p>
        {data._id !== user?.user._id && (
          <motion.p
            whileTap={{ scale: 0.75 }}
            className="text-[10px]  font-semibold text-textColor px-1 bg-purple-200 rounded-sm hover:shadow-md"
          >
        {data.role === "admin" ? "Member" : "Admin"}
      </motion.p>
        )}
    </div>
    </motion.div >
  )
}



export default DashboardUsers;