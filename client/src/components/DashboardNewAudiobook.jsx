import React, { useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";

import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { storage } from "../config/firebase.config";
import { useStateValue } from "../Context/StateProvider";
import FilterButtons from "./FilterButtons";
import {
  getAllSeries,
  getAllAuthors,
  getAllAudiobooks,
  saveNewSeries,
  saveNewAuthor,
  saveNewAudiobook,
} from "../api";
import { actionType } from "../Context/reducer";
import { filterByLanguage, filters } from "../utils/supportfunctions";
import { IoMusicalNote } from "react-icons/io5";
import AlertSuccess from "./AlertSuccess";
import AlertError from "./AlertError";

export const ImageLoader = ({ progress }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-textColor">
        {Math.round(progress) > 0 && <>{`${Math.round(progress)}%`}</>}
      </p>
      <div className="w-20 h-20 min-w-[40px] bg-red-600  animate-ping  rounded-full flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-red-600 blur-xl "></div>
      </div>
    </div>
  );
};

export const ImageUploader = ({
  setImageURL,
  setAlert,
  alertMsg,
  isLoading,
  isImage,
  setProgress,
}) => {
  const uploadImage = (e) => {
    isLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(
      storage,
      `${isImage ? "Images" : "Audio"}/${Date.now()}-${imageFile.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },

      (error) => {
        setAlert("error");
        alertMsg("File upload failed.");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        isLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageURL(downloadUrl);
          setProgress(0);
          isLoading(false);
          setAlert("success");
          alertMsg("File uploaded successfully");
          setTimeout(() => {
            setAlert(null);
          }, 4000);
        });
      }
    );
  };

  return (
    <label>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <p className="font-bold text-2xl">
            <BiCloudUpload />
          </p>
          <p className="text-lg">
            click to upload {isImage ? "image" : "audio"}
          </p>
        </div>
      </div>
      <input
        type="file"
        name="upload-image"
        accept={`${isImage ? "image/*" : "audio/*"}`}
        onChange={uploadImage}
        className="w-0 h-0"
      />
    </label>
  );
};

export const DisabledButton = () => {
  return (
    <button
      disabled
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
    >
      <svg
        role="status"
        className="inline w-4 h-4 mr-3 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      Loading...
    </button>
  );
};

const DashboardNewAudiobook = () => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [audiobookImageUrl, setAudiobookImageUrl] = useState(null);
  const [setAlert, setSetAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const [audiobookName, setAudiobookName] = useState("");
  const [audioAsset, setAudioAsset] = useState(null);
  const [duration, setDuration] = useState(null);
  const audioRef = useRef();

  const [
    {
      allAuthors,
      allSeries,
      seriesFilter,
      authorFilter,
      filterTerm,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  useEffect(() => {
    if (!allAuthors) {
      getAllAuthors().then((data) => {
        dispatch({ type: actionType.SET_ALL_AUTHORS, allAuthors: data.data });
      });
    }

    if (!allSeries) {
      getAllSeries().then((data) => {
        dispatch({ type: actionType.SET_ALL_SERIES, allSeries: data.data });
      });
    }
  }, []);

  console.log(allSeries)

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnMin} : ${returnSec}`;
  };

  const deleteImageObject = (audiobookUrl, action) => {
    if (action === "image") {
      setIsImageLoading(true);
      setAudiobookImageUrl(null);
    } else {
      setIsAudioLoading(true);
      setAudioAsset(null);
    }
    const deleteRef = ref(storage, audiobookUrl);
    deleteObject(deleteRef).then(() => {
      setSetAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
    });
  };

  const saveAudiobook = () => {
    if (!audiobookImageUrl || !audioAsset || !audiobookName) {
      setSetAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
    } else {
      setIsImageLoading(true);
      setIsAudioLoading(true);
      const data = {
        name: audiobookName,
        imageURL: audiobookImageUrl,
        audiobookUrl: audioAsset,
        series: seriesFilter,
        author: authorFilter,
        language: languageFilter,
        genre: filterTerm,
      };

      saveNewAudiobook(data).then((res) => {
        getAllAudiobooks().then((audiobook) => {
          dispatch({ type: actionType.SET_ALL_AUDIOBOOKS, allAudiobooks: audiobook.data });
        });
      });
      setSetAlert("success");
      setAlertMsg("Data saved successfully");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
      setAudiobookName("");
      setAudiobookImageUrl(null);
      setAudioAsset(null);
      dispatch({ type: actionType.SET_AUTHOR_FILTER, authorFilter: null });
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
      dispatch({ type: actionType.SET_SERIES_FILTER, seriesFilter: null });
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
      setDuration(null);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Type your Audiobook name"
            className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            value={audiobookName}
            onChange={(e) => setAudiobookName(e.target.value)}
          />

          <div className="flex w-full justify-between flex-wrap items-center gap-4">
            <FilterButtons filterData={allAuthors} flag={"Author"} />
            <FilterButtons filterData={allSeries} flag={"Series"} />
            <FilterButtons filterData={filterByLanguage} flag={"Language"} />
            <FilterButtons filterData={filters} flag={"Genre"} />
          </div>

          <div className="flex items-center justify-between gap-2 w-full flex-wrap">
            <div className="bg-card  backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
              {isImageLoading && <ImageLoader progress={uploadProgress} />}
              {!isImageLoading && (
                <>
                  {!audiobookImageUrl ? (
                    <ImageUploader
                      setImageURL={setAudiobookImageUrl}
                      setAlert={setSetAlert}
                      alertMsg={setAlertMsg}
                      isLoading={setIsImageLoading}
                      setProgress={setUploadProgress}
                      isImage={true}
                    />
                  ) : (
                    <div className="relative w-full h-full overflow-hidden rounded-md">
                      <img
                        src={audiobookImageUrl}
                        alt="uploaded image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(audiobookImageUrl, "image");
                        }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-card  backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
              {isAudioLoading && <ImageLoader progress={uploadProgress} />}
              {!isAudioLoading && (
                <>
                  {!audioAsset ? (
                    <ImageUploader
                      setImageURL={setAudioAsset}
                      setAlert={setSetAlert}
                      alertMsg={setAlertMsg}
                      isLoading={setIsAudioLoading}
                      setProgress={setUploadProgress}
                      isImage={false}
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                      <audio ref={audioRef} src={audioAsset} controls />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(audioAsset, "audio");
                        }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-end w-full p-4">
              {isImageLoading || isAudioLoading ? (
                <DisabledButton />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.75 }}
                  className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
                  onClick={saveAudiobook}
                >
                  Send
                </motion.button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full p-4">
          <AddNewAuthor />
          <AddNewSeries />
        </div>
      </div>
      {setAlert && (
        <>
          {setAlert === "success" ? (
            <AlertSuccess msg={alertMsg} />
          ) : (
            <AlertError msg={alertMsg} />
          )}
        </>
      )}
    </div>
  );
};

export const AddNewAuthor = () => {
  const [isAuthor, setIsAuthor] = useState(false);
  const [authorProgress, setAuthorProgress] = useState(0);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [authorCoverImage, setAuthorCoverImage] = useState(null);

  const [authorName, setAuthorName] = useState("");

  const [{ author }, dispatch] = useStateValue();

  const deleteImageObject = (audiobookUrl) => {
    setIsAuthor(true);
    setAuthorCoverImage(null);
    const deleteRef = ref(storage, audiobookUrl);
    deleteObject(deleteRef).then(() => {
      setAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      setIsAuthor(false);
    });
  };

  const saveAuthor = () => {
    if (!authorCoverImage || !authorName) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } else {
      setIsAuthor(true);
      const data = {
        name: authorName,
        imageURL: authorCoverImage,
      };
      saveNewAuthor(data).then((res) => {
        getAllAuthors().then((authorData) => {
          dispatch({ type: actionType.SET_ALL_AUTHORS, author: authorData.data });
        });
      });
      setIsAuthor(false);
      setAuthorCoverImage(null);
      setAuthorName("");
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isAuthor && <ImageLoader progress={authorProgress} />}
        {!isAuthor && (
          <>
            {!authorCoverImage ? (
              <ImageUploader
                setImageURL={setAuthorCoverImage}
                setAlert={setAlert}
                alertMsg={setAlertMsg}
                isLoading={setIsAuthor}
                setProgress={setAuthorProgress}
                isImage={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={authorCoverImage}
                  alt="uploaded image"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => {
                    deleteImageObject(authorCoverImage);
                  }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 ">
        <input
          type="text"
          placeholder="Author Name"
          className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />

        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
          {isAuthor ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
              onClick={saveAuthor}
            >
              Send
            </motion.button>
          )}
        </div>
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
    </div>
  );
};

export const AddNewSeries = () => {
  const [isSeries, setIsSeries] = useState(false);
  const [seriesProgress, setSeriesProgress] = useState(0);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [seriesCoverImage, setSeriesCoverImage] = useState(null);

  const [seriesName, setSeriesName] = useState("");

  const [{ series }, dispatch] = useStateValue();

  const deleteImageObject = (audiobookUrl) => {
    setIsSeries(true);
    setSeriesCoverImage(null);
    const deleteRef = ref(storage, audiobookUrl);
    deleteObject(deleteRef).then(() => {
      setAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      setIsSeries(false);
    });
  };

  const saveSeries = () => {
    if (!seriesCoverImage || !seriesName) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } else {
      setIsSeries(true);
      const data = {
        name: seriesName,
        imageURL: seriesCoverImage,
      };
      saveNewSeries(data).then((res) => {
        getAllSeries().then((seriesData) => {
          dispatch({
            type: actionType.SET_ALL_SERIES,
            seriesData: seriesData.data,
          });
        });
      });
      setIsSeries(false);
      setSeriesCoverImage(null);
      setSeriesName("");
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isSeries && <ImageLoader progress={seriesProgress} />}
        {!isSeries && (
          <>
            {!seriesCoverImage ? (
              <ImageUploader
                setImageURL={setSeriesCoverImage}
                setAlert={setAlert}
                alertMsg={setAlertMsg}
                isLoading={setIsSeries}
                setProgress={setSeriesProgress}
                isImage={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={seriesCoverImage}
                  alt="uploaded image"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => {
                    deleteImageObject(seriesCoverImage);
                  }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 ">
        <input
          type="text"
          placeholder="Series Name"
          className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={seriesName}
          onChange={(e) => setSeriesName(e.target.value)}
        />

        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
          {isSeries ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
              onClick={saveSeries}
            >
              Send
            </motion.button>
          )}
        </div>
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
    </div>
  );
};

export default DashboardNewAudiobook;
