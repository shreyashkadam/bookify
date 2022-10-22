import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineClear } from "react-icons/ai";
import { deleteAudiobookById, getAllAudiobooks } from "../api";
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";
import { IoAdd, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";

const DashboardAudiobooks = () => {
  const [audiobookFilter, setAudiobookFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredAudiobooks, setFilteredAudiobooks] = useState(null);

  const [{ allAudiobooks }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allAudiobooks) {
      getAllAudiobooks().then((data) => {
        dispatch({
          type: actionType.SET_ALL_AUDIOBOOKS,
          allAudiobooks: data.data,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (audiobookFilter.length > 0) {
      const filtered = allAudiobooks.filter(
        (data) =>
          data.author.toLowerCase().includes(audiobookFilter) ||
          data.language.toLowerCase().includes(audiobookFilter) ||
          data.name.toLowerCase().includes(audiobookFilter)
      );
      setFilteredAudiobooks(filtered);
    } else {
      setFilteredAudiobooks(null);
    }
  }, [audiobookFilter]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/dashboard/newAudiobook"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Search here"
          className={`w-52 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          value={audiobookFilter}
          onChange={(e) => setAudiobookFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {audiobookFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setAudiobookFilter("");
              setFilteredAudiobooks(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-textColor cursor-pointer" />
          </motion.i>
        )}
      </div>

      <div className="relative w-full  my-4 p-4 py-12 border border-gray-300 rounded-md">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold">
            <span className="text-sm font-semibold text-textColor">
              Count :{" "}
            </span>
            {filteredAudiobooks ? filteredAudiobooks?.length : allAudiobooks?.length}
          </p>
        </div>

        <AudiobookContainer data={filteredAudiobooks ? filteredAudiobooks : allAudiobooks} />
      </div>
    </div>
  );
};

export const AudiobookContainer = ({ data }) => {
  return (
    <div className=" w-full  flex flex-wrap gap-3  items-center justify-evenly">
      {data &&
        data.map((audiobook, i) => (
          <AudiobookCard key={audiobook._id} data={audiobook} index={i} />
        ))}
    </div>
  );
};

export const AudiobookCard = ({ data, index }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const [{ allAudiobooks, audiobook, isAudiobookPlaying }, dispatch] = useStateValue();

  const addAudiobookToContext = () => {
    if (!isAudiobookPlaying) {
      dispatch({
        type: actionType.SET_AUDIOBOOK_PLAYING,
        isAudiobookPlaying: true,
      });
    }
    if (audiobook !== index) {
      dispatch({
        type: actionType.SET_AUDIOBOOK,
        audiobook: index,
      });
    }
  };

  const deleteObject = (id) => {
    console.log(id);
    deleteAudiobookById(id).then((res) => {
      // console.log(res.data);
      if (res.data.success) {
        setAlert("success");
        setAlertMsg(res.data.msg);
        getAllAudiobooks().then((data) => {
          dispatch({
            type: actionType.SET_ALL_AUDIOBOOKS,
            allAudiobooks: data.data,
          });
        });
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      } else {
        setAlert("error");
        setAlertMsg(res.data.msg);
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      }
    });
  };
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-60 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
      onClick={addAudiobookToContext}
    >
      {isDeleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="absolute z-10 p-2 inset-0 bg-card backdrop-blur-md flex flex-col gap-6 items-center justify-center"
        >
          <p className="text-sm text-center text-textColor font-semibold">
            Are you sure do you want to delete this Audiobook?
          </p>

          <div className="flex items-center gap-3">
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-teal-400"
              onClick={() => deleteObject(data._id)}
            >
              Yes
            </button>
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-gray-400"
              onClick={() => setIsDeleted(false)}
            >
              No
            </button>
          </div>
        </motion.div>
      )}

      <div className="w-40 min-w-[180px] h-40 min-h-[263px] rounded-lg drop-shadow-lg relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          alt=""
          className=" w-full h-full rounded-lg object-cover"
        />
      </div>

      <p className="text-base text-headingColor font-semibold my-2">
        {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
        <span className="block text-sm text-gray-400 my-1">{data.author}</span>
      </p>

      <div className="w-full absolute bottom-2 right-2 flex items-center justify-between px-4">
        <motion.i whileTap={{ scale: 0.75 }} onClick={() => setIsDeleted(true)}>
          <IoTrash className="text-base text-red-400 drop-shadow-md hover:text-red-600" />
        </motion.i>
      </div>

      {alert && (
        <>
          {alert === "success" ? (
            <AlertSuccess msg={alertMsg} />
          ) : (
            <AlertError msg={alertMsg} />
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardAudiobooks;
