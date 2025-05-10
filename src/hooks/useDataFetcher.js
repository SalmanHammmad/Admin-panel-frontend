// hooks/useDataFetcher.js
import { useState, useEffect, useCallback } from "react";

export const useDataFetcher = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (loading) return; // Prevent concurrent fetches
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        }
        if (response.status === 403) {
          throw new Error("Forbidden: You do not have access to this resource");
        }
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]); // Depend on url to recreate fetchData only when url changes

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, fetchData]);

  return { data, loading, error, fetchData, setData };
};