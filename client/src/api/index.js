import axios from "axios"

const baseURL = "http://localhost:4000/";

export const validateUser = async (token) => {
    try {
      const res = await axios.get(`${baseURL}api/users/login`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return res.data;
    } catch (error) {
      return null;
    }
  };

  export const getAllUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}api/users/getUsers`);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  export const getAllAudiobooks = async () => {
    try {
      const res = await axios.get(`${baseURL}api/audiobook/getALL`);
      return res.data;
    } catch (error) {
      return null;
    }
  };
  
  export const getAllSeries = async () => {
    try {
      const res = await axios.get(`${baseURL}api/series/getALL`);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  export const getAllAuthors = async () => {
    try {
      const res = await axios.get(`${baseURL}api/author/getAll`);
      return res.data;
    } catch (error) {
      return null;
    }
  };