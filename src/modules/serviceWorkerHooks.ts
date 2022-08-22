import { useEffect } from "react";

export const useRegisterServiceWorker = () => {
  useEffect(() => {
    const register = async () => {
      if (!("serviceWorker" in navigator)) {
        return;
      }

      const registration = await navigator.serviceWorker
        .register("/serviceWorker.js")
        .catch((error) => {
          if (error instanceof Error) {
            return error;
          }

          throw Promise.reject(error);
        });

      if (registration instanceof Error) {
        console.log("Service Worker registration failed: ", registration);
        return;
      }

      console.log(
        "Service Worker registration successful with scope: ",
        registration.scope
      );
    };

    register();
  }, []);
};
