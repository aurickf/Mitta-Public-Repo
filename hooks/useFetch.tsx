import axios from "axios";
import { useState } from "react";

const useFetch = (path: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_HOST;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;

  //Check path for trailing slashes, add if neccesary
  if (path.slice(-1) !== "/") path += "/";

  const getDataById = async (_id = null) => {
    setIsLoading(true);
    try {
      const res = await axios.get(path, { params: { _id: _id } });
      if (res.status === 200) {
        setData(res.data);
        setError(null);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const getData = async (value = null) => {
    setIsLoading(true);
    try {
      const res = await axios.get(path, { params: value });
      if (res.status === 200) {
        setData(res.data);
        setError(null);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const addData = async (value = null) => {
    setIsLoading(true);
    try {
      const res = await axios.post(path, value);
      if (res.status === 200) {
        setError(null);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const deleteData = async (_id = null) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(path + _id);
      if (res.status === 200) {
        setError(null);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const updateData = async (value = null) => {
    setIsLoading(true);
    try {
      const res = await axios.put(path + value._id, value);
      if (res.status === 200) {
        setError(null);
      }
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      return await axios.delete(path);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    data,
    error,
    getData,
    getDataById,
    addData,
    deleteData,
    updateData,
    logout,
  };
};

export default useFetch;
