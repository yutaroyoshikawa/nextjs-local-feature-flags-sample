import type { IncomingHttpHeaders } from "http";
import { DB, openDb } from "./clientDb";

type FeatureToggle = {
  name: string;
  enabled: boolean;
};

export const initialFeatureToggles: Record<"hoge", boolean> = {
  hoge: true,
};

export const migrationFeatureToggles = (db: IDBDatabase): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const objectStore = db.createObjectStore(DB.featureToggle.storeNames[0], {
      keyPath: "name",
    });

    objectStore.transaction.oncomplete = () => {
      const transaction = db.transaction(
        DB.featureToggle.storeNames[0],
        "readwrite"
      );

      const featureToggleStore = transaction.objectStore(
        DB.featureToggle.storeNames[0]
      );

      Object.entries(initialFeatureToggles).map(([flagName, enabled]) => {
        featureToggleStore.add({ name: flagName, enabled });
      });

      resolve();
    };

    objectStore.transaction.onerror = () => {
      reject(objectStore.transaction.error);
    };
  });
};

export const getFeatureToggles = async () => {
  return new Promise<FeatureToggle[]>(async (resolve, reject) => {
    const db = await openDb("featureToggle").catch((error) => {
      if (error instanceof DOMException) {
        return error;
      }

      return Promise.reject(error);
    });

    if (db instanceof Error) {
      console.log(db);
      return;
    }

    const transaction = db.transaction(
      DB.featureToggle.storeNames[0],
      "readonly"
    );

    const featureToggleStore = transaction.objectStore(
      DB.featureToggle.storeNames[0]
    );

    const request = featureToggleStore.getAll();

    request.onsuccess = () => {
      resolve(request.result);
      db.close();
    };

    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
};

export const FEATURE_TOGGLE_HEADER_NAME = "Dev-Feature-Toggle";

export const appendFeatureToggleRequest = async (request: Request) => {
  const defaultHeaders = Object.fromEntries(request.headers.entries());

  const featureToggles = await getFeatureToggles();

  const enabledToggleNames = featureToggles
    .filter(({ enabled }) => enabled)
    .map(({ name }) => name)
    .join(",");

  const appendFeatureToggleRequest = new Request(request, {
    headers: {
      ...defaultHeaders,
      [FEATURE_TOGGLE_HEADER_NAME]: enabledToggleNames,
    },
  });

  return appendFeatureToggleRequest;
};

export const httpHeadersToEnabledToggleNames = (
  httpHeaders: IncomingHttpHeaders
) => {
  const toggleHeader = httpHeaders[FEATURE_TOGGLE_HEADER_NAME.toLowerCase()];

  const value = Array.isArray(toggleHeader) ? toggleHeader[0] : toggleHeader;

  const enabledToggleNames = value?.split(",").map((flagName) => flagName);

  return enabledToggleNames;
};

export const generateFeatureFlags = (enabledToggleNames?: string[]) => {
  if (process.env.NODE_ENV === "production") {
    return initialFeatureToggles;
  }

  const enabledToggleEntries = enabledToggleNames?.map(
    (flagName) => [flagName, true] as const
  );

  const toggles = {
    ...initialFeatureToggles,
    ...Object.fromEntries(enabledToggleEntries ?? []),
  };

  return toggles;
};
