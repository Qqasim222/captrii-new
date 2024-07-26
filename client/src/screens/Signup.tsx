import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

declare global {
  interface Window {
    google: any;
  }
}

const SignUp: React.FC = () => {
  const { handleGoogle, loading, error } = useFetch(
    `${process.env.REACT_APP_API_URL}/users/signup`
  );

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
        callback: handleGoogle,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("signUpDiv"),
        {
          theme: "filled_black",
          text: "continue_with",
          shape: "pill",
        }
      );

      // window.google.accounts.id.prompt()
    }
  }, [handleGoogle]);

  return (
    <>
      <nav style={{ padding: "2rem" }}>
        <Link to="/">Go Back</Link>
      </nav>
      <header style={{ textAlign: "center" }}>
        <h1>Register to continue</h1>
      </header>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading ? (
          <div>Loading....</div>
        ) : (
          <div id="signUpDiv" data-text="signup_with"></div>
        )}
      </main>
      <footer></footer>
    </>
  );
};

export default SignUp;
