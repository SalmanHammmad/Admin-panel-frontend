// hooks/useDataFetcher.js
import { useState, useEffect } from "react";
import axios from "axios";

export const useDataFetcher = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); // Adjust based on your auth
      console.log("Fetching data from:::::::", url); // Debug URL
      if (!token) {
        console.error("No token found in localStorage");
        setError("Please log in to perform this action.");
        return;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     

      console.log("API Response:", response.data); // Debug response
      setData(response.data.data); // Extract marquee array
    } catch (err) {
      
      console.error("Fetch Error:", err.response || err); // Debug error
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, setData, fetchData };
};