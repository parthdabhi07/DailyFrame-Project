import { apiClient } from "./apiClient";

export const executeJwtAuthenticationService = async (email, password) => {
    try {
        const response = await apiClient.post(`/authenticate`, { email, password });
        console.log("API Call Successful:", response);
        return response;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error; // Ensure error is handled in `login()` 
    }
};