import axios from 'axios';
import {apiURL} from "./BaseUrl.ts";
const axiosApi = axios.create({
    baseURL: apiURL
});
export default axiosApi;