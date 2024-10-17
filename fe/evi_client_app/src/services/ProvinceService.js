import axios from "axios";
const BASE_URL = "http://localhost:8080";
const GETALLPROVINCE = "/getallprovince";
export const listProvince = () => axios.get(`${BASE_URL}${GETALLPROVINCE}`);
