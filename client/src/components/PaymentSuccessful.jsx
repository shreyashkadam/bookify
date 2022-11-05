import React from 'react'
import { makePremium, getAllUsers } from '../api';
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import Loader from './Loader';
import { async } from '@firebase/util';

const PaymentSuccessful = () => {
    const [{ allUsers, user }, dispatch] = useStateValue();
    const navigate = useNavigate();

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

    const timeout = (num) => {
      return new Promise(res => setTimeout(res, num))
    }

    const updatePremium = (userId) => {
        makePremium(userId).then(async(res) => {
            if (res) {              
              getAllUsers().then((data) => {
                dispatch({
                  type: actionType.SET_ALL_USERS,
                  allUsers: data.data,
                });
              });
              navigate("/");
              await timeout(5000);
              window.location.reload(false);
              
            }
          });
    }

    updatePremium(user?.user._id);   
  
}



export default PaymentSuccessful