import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom'
import { getAllAudiobooks } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import { AudiobookCard } from "./DashboardAudiobooks";
import Filter from "./Filter";
import Header from "./Header";
import SearchBar from "./SearchBar";
import { FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const [
    {
      searchTerm,
      isAudiobookPlaying,
      audiobook,
      allAudiobooks,
      authorFilter,
      filterTerm,
      seriesFilter,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  const [filteredAudiobooks, setFilteredAudiobooks] = useState(null);

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
    if (searchTerm.length > 0) {
      const filtered = allAudiobooks.filter(
        (data) =>
          data.author.toLowerCase().includes(searchTerm) ||
          data.language.toLowerCase().includes(searchTerm) ||
          data.name.toLowerCase().includes(searchTerm) ||
          data.author.includes(authorFilter)
      );
      setFilteredAudiobooks(filtered);
    } else {
      setFilteredAudiobooks(null);
    }
  }, [searchTerm]);

  useEffect(() => {
    const filtered = allAudiobooks?.filter((data) => data.author === authorFilter);
    if (filtered) {
      setFilteredAudiobooks(filtered);
    } else {
      setFilteredAudiobooks(null);
    }
  }, [authorFilter]);

  useEffect(() => {
    const filtered = allAudiobooks?.filter(
      (data) => data.genre.toLowerCase() === filterTerm
    );
    if (filtered) {
      setFilteredAudiobooks(filtered);
    } else {
      setFilteredAudiobooks(null);
    }
  }, [filterTerm]);

  useEffect(() => {
    const filtered = allAudiobooks?.filter((data) => data.series === seriesFilter);
    if (filtered) {
      setFilteredAudiobooks(filtered);
    } else {
      setFilteredAudiobooks(null);
    }
  }, [seriesFilter]);

  useEffect(() => {
    const filtered = allAudiobooks?.filter(
      (data) => data.language === languageFilter
    );
    if (filtered) {
      setFilteredAudiobooks(filtered);
    } else {
      setFilteredAudiobooks(null);
    }
  }, [languageFilter]);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <SearchBar />

      {searchTerm.length > 0 && (
        <p className="my-4 text-base text-textColor">
          Searched for :
          <span className="text-xl text-cartBg font-semibold">
            {searchTerm}
          </span>
        </p>
      )}

      <Filter setFilteredAudiobooks={setFilteredAudiobooks} />

      <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4">
        <HomeAudiobookContainer musics={filteredAudiobooks ? filteredAudiobooks : allAudiobooks} />
      </div>
    </div>
  );
};

export const HomeAudiobookContainer = ({ musics }) => {
  const navigate = useNavigate;
  const [isClicked, setIsClicked] = useState(false);
  const [alert, setAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [{ user, isAudiobookPlaying, audiobook }, dispatch] = useStateValue();

  const addAudiobookToContext = (index) => {
    if (user?.user.role === "admin" || user?.user.isPremium === true) {
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
    } else {
      setAlert("success");
      setAlertMsg("Buy premium to enjoy listening Audiobook!")
      setTimeout(() => {
        setAlert(null);
      }, 8000);
    }
  };

  const AlertPremium = ({ msg }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.6 }}
        animate={{ opacity: 1, y: 50, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.6 }}
        className="w-screen z-50 fixed top-10 left-0 flex items-center justify-center"
      >
        <div className="w-460  bg-card rounded-md shadow-md backdrop-blur-md px-4 py-2 flex items-center gap-4">
          <div className="w-[4px] h-10 bg-yellow-500 rounded-md"></div>
          <FaCrown className="text-xl text-yellow-500" />
          <p className="text-base font-semibold text-textColor">
            {msg?.length > 50 ? `${msg?.slice(0, 50)}...` : msg}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {musics?.map((data, index) => (
        <motion.div
          key={data._id}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-60 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
          onClick={() => addAudiobookToContext(index)}
        >
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
            <span className="block text-sm text-gray-400 my-1">
              {data.author}
            </span>
          </p>
          {alert === "success" && (
            <>
              <AlertPremium msg={alertMsg} />
            </>
          )}
        </motion.div>
      ))}
    </>
  );
};

export default Home;
