import { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface GoogleResponse {
  accessToken: string;
}

interface UsePostReturn {
  isLoading: boolean;
  isError: string;
  handleMicrosoft: (response: GoogleResponse) => Promise<void>;
}

const usePost = (url: string): UsePostReturn => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const handleMicrosoft = async (response: GoogleResponse): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.accessToken,
          provider: "microsoft",
        }),
      });

      setLoading(false);
      const data = await res.json();

      if (data?.user) {
        sessionStorage.setItem("ms_user", JSON.stringify(data.user)); // Store in sessionStorage
        window.location.reload();
      } else {
        throw new Error(data?.message || data);
      }
    } catch (error: any) {
      setIsError(error.message);
      toast.error(error.message); // Show error using toast
    }
  };

  return { isLoading, isError, handleMicrosoft };
};

export default usePost;
