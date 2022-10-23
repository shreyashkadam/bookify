import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, Login, Dashboard, MusicPlayer } from "./components";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { validateUser } from "./api";
import { useStateValue } from "./Context/StateProvider";
import { actionType } from "./Context/reducer";



const App = () => {
    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();

    const [{ user, isAudiobookPlaying }, dispatch] = useStateValue();

    const [auth, setAuth] = useState(
        false || window.localStorage.getItem("auth") === "true"
    );

    useEffect(() => {
        firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
                userCred.getIdToken().then((token) => {
                    // console.log(token);
                    validateUser(token).then((data) => {
                        dispatch({
                            type: actionType.SET_USER,
                            user: data,
                        })
                    })
                })
            } else {
                setAuth(false);
                window.localStorage.setItem("auth", "false");
                dispatch({
                    type: actionType.SET_USER,
                    user: null,
                })
                navigate("/login")
            }
        })
    }, []);

    return (
        <AnimatePresence exitBeforeEnter>


            <div className="h-auto min-w-[680px] bg-primary flex justify-center items-center">
                <Routes>
                    <Route path="/login" element={<Login setAuth={setAuth} />} />
                    <Route path="/*" element={<Home />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
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