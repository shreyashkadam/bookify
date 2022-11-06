import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import {BsGoogle} from 'react-icons/bs'
import { app } from "../config/firebase.config"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useStateValue } from '../Context/StateProvider';
import { validateUser } from '../api';
import { actionType } from '../Context/reducer';
import { LoginBg } from '../assets/video';
import { CompleteLogo } from '../assets/img/index'

const Login = ({ setAuth }) => {

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();

  const [{ user }, dispatch] = useStateValue();

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem("auth", "true")

        firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred) {
            userCred.getIdToken().then((token) => {
              validateUser(token).then((data) => {
                dispatch({
                  type: actionType.SET_USER,
                  user: data,
                });
              });
            })
            navigate("/", { replace: true })
          } else {
            setAuth(false);
            dispatch({
              type: actionType.SET_USER,
              user: null,
            });
            navigate("/login")
          }
        })
      }
    });
  };

  useEffect(() => {
    if (window.localStorage.getItem("auth") === "true")
      navigate("/", { replace: true });
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <video src={LoginBg}
        type="video/mp4"
        autoPlay
        muted
        loop
        className='w-full h-full object-cover' />
      <div className="absolute inset-0 bg-darkOverlay flex items-center justify-center p-4">
        <div className="w-full md:w-375 p-8 bg-lightOverlay shadow-2xl rounded-md backdrop-blur-md flex flex-col items-center justify-center gap-6">
          <img src={CompleteLogo} className="h-18"/>
          <div onClick={loginWithGoogle} className="flex items-center justify-center  gap-2 px-4 py-2 rounded-md bg-cardOverlay cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all"
          >
            <BsGoogle className="text-xl" />
            <p>Sign in with Google</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login