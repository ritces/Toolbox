import axios from "axios";
import { SERVER, TOKEN } from "../apiKeys.js"

// this should be save Environment variables but in the test they said they cant be use
export const getFiles = (search) => {
  return (
    axios.create({
      baseURL: SERVER,
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json"
      },
    }).get(`/files/data?fileName=${search}`)
      .then((res) => res.data)
      .catch((error) => { throw error })
  )
};
