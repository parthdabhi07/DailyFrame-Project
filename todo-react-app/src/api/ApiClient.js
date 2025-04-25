import axios from "axios";

// Create an axios client with the common baseUrl - no need to repeat it in every request
export const apiClient = axios.create(
    {
        baseURL: 'http://localhost:8080'
    }
);