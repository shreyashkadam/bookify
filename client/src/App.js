import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, Login, Dashboard, MusicPlayer, UserProfile, Loader, PaymentSuccessful } from "./components";
import "./App.css";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { validateUser, getAllAudiobooks } from "./api";
import { useStateValue } from "./Context/StateProvider";
import { actionType } from "./Context/reducer";



const App = () => {
    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();

    const [{ user, isAudiobookPlaying, allAudiobooks, audiobook, miniPlayer }, dispatch] = useStateValue();
    const [isLoading, setIsLoading] = useState(false);

    const [auth, setAuth] = useState(
        false || window.localStorage.getItem("auth") === "true"
    );

    useEffect(() => {
        setIsLoading(true);
        firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
                userCred.getIdToken().then((token) => {
                    // console.log(token);
                    validateUser(token).then((data) => {
                        dispatch({
                            type: actionType.SET_USER,
                            user: data,
                        });
                    });
                });
            } else {
                setAuth(false);
                dispatch({
                    type: actionType.SET_USER,
                    user: null,
                });
                setIsLoading(false);
                window.localStorage.setItem("auth", "false");
                navigate("/login")
            }
        })
    }, []);

    useEffect(() => {
        if (!allAudiobooks && user) {
            getAllAudiobooks().then((data) => {
                dispatch({
                    type: actionType.SET_ALL_AUDIOBOOKS,
                    allAudiobooks: data.data,
                });
            });
        }
    }, []);

    return (
        <AnimatePresence>
            <div className="h-auto flex items-center justify-center min-w-[680px]">
                {isLoading ||
                    (!user && (
                        <div className="fixed inset-0 bg-loaderOverlay backdrop-blur-sm ">
                            <Loader />
                        </div>
                    ))}
                <Routes>
                    <Route path="/login" element={<Login setAuth={setAuth} />} />
                    <Route path="/*" element={<Home />} />
                    <Route path="/paymentsuccess" element={<PaymentSuccessful/>} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="/userProfile" element={<UserProfile />} />
                </Routes>

                {isAudiobookPlaying && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
                    >
                        <MusicPlayer />
                    </motion.div>
                )}
            </div>
        </AnimatePresence>

    )
}

export default App