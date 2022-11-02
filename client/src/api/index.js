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
      const res = await axios.get(`${baseURL}api/author/getALL`);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  export const changingUserRole = async (userId, role) => {
    try {
      const res = axios.put(`${baseURL}api/users/updateRole/${userId}`, {
        data: { role: role },
      });
      return res;
    } catch (error) {
      return null;
    }
  };

  export const makePremium = async (userId) => {
    try {
      const res = axios.put(`${baseURL}api/users/makePremium/${userId}`);
      return res;
    } catch (error) {
      return null;
    }
  };
  
  export const removeUser = async (userId) => {
    try {
      const res = axios.delete(`${baseURL}api/users/delete/${userId}`);
      return res;
    } catch (error) {
      return null;
    }
  };

  export const saveNewAuthor = async (data) => {
    try {
      const res = axios.post(`${baseURL}api/author/save`, { ...data });
      return (await res).data.author;
    } catch (error) {
      return null;
    }
  };
  
  export const saveNewSeries = async (data) => {
    try {
      const res = axios.post(`${baseURL}api/series/save`, { ...data });
      return (await res).data.series;
    } catch (error) {
      return null;
    }
  };
  
  export const saveNewAudiobook = async (data) => {
    try {
      const res = axios.post(`${baseURL}api/audiobook/save`, { ...data });
      return (await res).data.audiobook;
    } catch (error) {
      return null;
    }
  };
  
  export const deleteAudiobookById = async (id) => {
    try {
      const res = axios.delete(`${baseURL}api/audiobook/delete/${id}`);
      return res;
    } catch (error) {
      return null;
    }
  };

  export const deleteAuthorById = async (id) => {
    try {
      const res = axios.delete(`${baseURL}api/author/delete/${id}`);
      return res;
    } catch (error) {
      return null;
    }
  };

  export const deleteSeriesById = async (id) => {
    try {
      const res = axios.delete(`${baseURL}api/series/delete/${id}`);
      return res;
    } catch (error) {
      return null;
    }
  };

  export const checkoutPayment = async (amount) => {
    try {
      const res = await axios.post(`${baseURL}api/payment/checkout`, {amount});
      return res.data;
    } catch (error) {
      return null;
    }
  };