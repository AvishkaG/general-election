import axios from "axios";
import { ElectionResults, VoteUpdatePayload } from "./types";

const API_URL =
  "https://corsproxy.io/?" +
  encodeURIComponent(
    "https://script.google.com/macros/s/AKfycbx3Ch8GJCQ7k_BTXAPxmMrwaiB0H6rDn2SqswKkAMmiGXQrJO-FGGjB_Iys-DIXU8DNlA/exec"
  );

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
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
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
