// api.ts
import axios from 'axios';

const baseURL = 'https://localhost:3000'; // Replace with your actual API base URL

const API = axios.create({
  baseURL,
});

export default API;



