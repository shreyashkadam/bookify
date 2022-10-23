import React from "react";
import Header from "./Header";
import moment from "moment";
import { useStateValue } from "../Context/StateProvider";
import { FaCrown } from "react-icons/fa";
import { GoVerified } from "react-icons/go";
import { NavLink, useNavigate } from 'react-router-dom';
import { app } from "../config/firebase.config";
import { getAuth } from "firebase/auth";


const UserProfile = () => {

  const [{ user }, dispatch] = useStateValue();
  const createdAt = moment(new Date(user?.user.createdAt)).format("MMMM Do YYYY");
  const toPrintDate = moment(createdAt, "MMMM Do YYYY").fromNow();

  const navigate = useNavigate;

  const logout = () => {
    const firebaseAuth = getAuth(app);
    firebaseAuth
      .signOut()
      .then(() => {
        window.localStorage.setItem("auth", "false");
      })
      .catch((e) => console.log(e));
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />

      <section class="pt-16 bg-blueGray-50 min-w-[450px]">
        <div class="w-full lg:w-4/12 px-4 mx-auto flex justify-center">
          <div class="relative flex flex-col min-w-[450px] break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
            <div class="flex flex-wrap justify-center">
              <div class="w-full px-4 flex justify-center">
                <div class="relative">
                  <img
                    className="w-12 min-w-[150px] align-middle object-cover rounded-full absolute -m-16 "
                    src={user?.user?.imageURL}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div class="w-full px-4 text-center mt-20">
                <div class="text-center mt-12">
                  <h3 class="text-xl font-semibold leading-normal text-blueGray-700 mb-1">
                    {user?.user.name}
                  </h3>
                  <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold flex justify-center">
                    <p className="flex items-center gap-2">
                      User {user?.user.email_verfied ? 'Verified' : 'Not Verified'}<GoVerified className="text-xm -ml-1 text-yellow-500" />
                    </p>
                  </div>
                  <div class="text-sm leading-normal mt-5 text-blueGray-400 font-semibold">
                    <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {user?.user.email}
                  </div>
                  <div class="text-sm leading-normal mt-5 text-blueGray-400 font-medium">
                    <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    Account Created: {toPrintDate}
                  </div>

                  <div class="mb-5 text-blueGray-600">
                    <i class="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                    <div class="flex space-x-2 justify-center">
                      <button
                        onClick={logout}
                        type="button"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                      >Logout</button>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
