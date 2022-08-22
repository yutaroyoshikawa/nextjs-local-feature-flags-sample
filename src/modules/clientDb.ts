import { migrationFeatureToggles } from "./featureToggle";

export const DB = {
  featureToggle: {
    name: "featureToggle",
    version: 1,
    storeNames: ["featureToggles"],
  },
} as const;

export const openDb = async (db: keyof typeof DB): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const requst = indexedDB.open(DB[db].name, DB[db].version);

    requst.onupgradeneeded = async () => {
      switch (db) {
        case "featureToggle": {
          await migrationFeatureToggles(requst.result);
        }
      }
    };

    requst.onsuccess = () => {
      resolve(requst.result);
    };

    requst.onerror = () => {
      reject(requst.error);
    };

    requst.onblocked = () => {
      reject(requst.error);
    };
  });
};
