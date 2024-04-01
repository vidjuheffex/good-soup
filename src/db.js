export function open() {
  return new Promise(function (resolve, reject) {
    let db;
    const request = indexedDB.open("database");

    request.onupgradeneeded = function () {
      // The database did not previously exist, so create object stores and indexes.
      db = request.result;
      const chemistryRecipeStore = db.createObjectStore("chemistry-recipes", {
        keyPath: "id",
      });
      chemistryRecipeStore.createIndex("by_id", "id");

      const developmentRecipeStore = db.createObjectStore(
        "development-recipes",
        {
          keyPath: "id",
        }
      );
      developmentRecipeStore.createIndex("by_filmstock", "filmStockId");
      developmentRecipeStore.createIndex("by_id", "id");

      const filmStockStore = db.createObjectStore("film-stocks", {
        keyPath: "id",
      });

      const sampleChemId = crypto.randomUUID();
      const sampleStockId = crypto.randomUUID();

      chemistryRecipeStore.put({
        id: sampleChemId,
        name: "Monobath Df96",
        temp: 72,
        notes: "",
        ratio: "1:0",
        shelfLife: "2m",
      });

      filmStockStore.put({ id: sampleStockId, name: "Kentmere 400" });
      developmentRecipeStore.put({
        id: crypto.randomUUID(),
        name: "Monobath Df96 - Intermittent Agitation",
        filmStockId: sampleStockId,
        steps: [
          {
            id: crypto.randomUUID(),
            initialAgitation: 30,
            agitationInversions: 4,
            agitationIntervals: 60,
            chemistry: sampleChemId,
            temp: 75,
            duration: 240,
          },
        ],
      });
    };

    request.onsuccess = function () {
      db = request.result;
      resolve(db);
    };

    request.onerror = function (error) {
      reject(error.target.error);
    };
  });
}

export function getOneFromStore(db, storeName, indexName, indexValue) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.get(indexValue);

    request.onsuccess = function () {
      resolve(request.result);
    };
  });
}

export function getAllFromStore(
  db,
  storeName,
  indexName = null,
  indexValue = null
) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    let index = null;
    let request = null;

    if (indexName) {
      index = store.index(indexName);
      request = index.openCursor(IDBKeyRange.only(indexValue));
    } else {
      request = store.openCursor();
    }

    const storeItems = [];

    request.onsuccess = function () {
      const cursor = request.result;
      if (cursor) {
        storeItems.push(cursor.value);
        cursor.continue();
      } else {
        resolve(storeItems);
      }
    };
  });
}

export function putObjectInStore(db, storeName, object) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    store.put(object);

    tx.oncomplete = function () {
      resolve();
    };

    tx.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
