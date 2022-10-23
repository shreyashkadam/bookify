import React, { useEffect, useState } from "react";
import { getAllAudiobooks } from "../api";
import { actionType } from "../Context/reducer";
import { useStateValue } from "../Context/StateProvider";
import { AudiobookCard } from "./DashboardAudiobooks";
import Filter from "./Filter";
import Header from "./Header";
import SearchBar from "./SearchBar";
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
  const [{ isAudiobookPlaying, audiobook }, dispatch] = useStateValue();

  const addAudiobookToContext = (index) => {
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
  return (
    <>
      {musics?.map((data, index) => (
        <motion.div
          key={data._id}
          whileTap={{ scale: 0.8 }}
          initial={{ opacity: 0, translateX: -50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
          onClick={() => addAudiobookToContext(index)}
        >
          <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
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
        </motion.div>
      ))}
    </>
  );
};

export default Home;
