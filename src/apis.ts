import axios from "axios";
import { ElectionResults, VoteUpdatePayload } from "./types";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyvPUmJYqCzHOmKuuyHl_9Fljb6BRF-4uRdqwKGzXPsZ3ak65dQncXf1r_6D1vq7farHw/exec";

export const fetchElectionData = async (): Promise<ElectionResults> => {
  try {
    const response = await axios.get(API_URL);

    // Assuming the API returns the data in the format you need
    const data = response.data;

    // Process the data (if needed) or return it
    return data;
  } catch (error) {
    console.error("Error fetching election data:", error);
    throw error; // Rethrow the error to handle it later in your code if necessary
  }
};

interface ApiResponse {
  success: boolean;
  message: string;
}

export const updateVotes = async (
  payload: VoteUpdatePayload
): Promise<ApiResponse> => {
  try {
    console.log(payload);

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating votes:", error);
    return {
      success: false,
      message: "Failed to update votes",
    };
  }
};
