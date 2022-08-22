import { appendFeatureToggleRequest } from "./modules/featureToggle";

self.addEventListener("fetch", (event) => {
  if (process.env.NODE_ENV === "production" || !(event instanceof FetchEvent)) {
    return;
  }

  const callback = async () => {
    const baseRequest = event.request.clone();
    const request = await appendFeatureToggleRequest(baseRequest);

    return fetch(request);
  };

  event.respondWith(callback());
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
