// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'amahirwemezabackend-production.up.railway.app/api/v1',
});

export default API;
