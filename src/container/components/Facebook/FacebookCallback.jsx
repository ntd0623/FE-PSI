import { useEffect } from "react";

const FacebookCallback = () => {
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");

    if (accessToken && window.opener) {
      window.opener.postMessage(
        { type: "facebook-auth-success", accessToken },
        "*"
      );
    }

    window.close();
  }, []);

  return <div>Đang xác thực Facebook...</div>;
};

export default FacebookCallback;
