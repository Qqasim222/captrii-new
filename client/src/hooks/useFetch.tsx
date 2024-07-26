import { useState } from "react";

interface GoogleResponse {
  credential: string;
}

interface UseFetchReturn {
  loading: boolean;
  error: string;
  handleGoogle: (response: GoogleResponse) => Promise<void>;
}

const useFetch = (url: string): UseFetchReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async (response: GoogleResponse): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      setLoading(false);
      const data = await res.json();

      if (data?.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user)); // Store in sessionStorage
        window.location.reload();
      } else {
        throw new Error(data?.message || data);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return { loading, error, handleGoogle };
};

export default useFetch;
