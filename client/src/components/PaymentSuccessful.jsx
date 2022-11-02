import React from 'react'
import { makePremium, getAllUsers } from '../api';
import { useStateValue } from "../Context/StateProvider";
import { actionType } from "../Context/reducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

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

    const updatePremium = (userId) => {
        makePremium(userId).then((res) => {
            if (res) {
              getAllUsers().then((data) => {
                dispatch({
                  type: actionType.SET_ALL_USERS,
                  allUsers: data.data,
                });
              });
              navigate("/");
            }
          });
    }

    updatePremium(user?.user._id);   
  
}



export default PaymentSuccessful