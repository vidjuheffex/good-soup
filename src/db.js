export function open() {
  return new Promise(function (resolve, reject) {
    let db;
    const request = indexedDB.open("database", 3);

    request.onupgradeneeded = function (event) {
      // The database did not previously exist, so create object stores and indexes.
      db = request.result;

      if (event.oldVersion < 1) {
        console.log("Initializing DB");
        const chemistryRecipeStore = db.createObjectStore("chemistry-recipes", {
          keyPath: "id",
        });
        chemistryRecipeStore.createIndex("by_id", "id");

        const developmentRecipeStore = db.createObjectStore(
          "development-recipes",
          {
            keyPath: "id",
          },
        );
        developmentRecipeStore.createIndex("by_filmstock", "filmstock_id");
        developmentRecipeStore.createIndex("by_id", "id");

        const filmStockStore = db.createObjectStore("film-stocks", {
          keyPath: "id",
        });

        const mixStore = db.createObjectStore("mixes", {
          keyPath: "id",
        });

        mixStore.createIndex("by_id", "id");
        mixStore.createIndex("by_chemistry", "chemistry_id");

        // Seed database with sample data

        const sampleChemId = crypto.randomUUID();
        const sampleStockId = crypto.randomUUID();

        chemistryRecipeStore.put({
          id: sampleChemId,
          name: "Monobath Df96",
          temp: 72,
          notes: "",
          ratio: "1:0",
          shelfLife: "2m",
          exhaustionRate: "15s",
          oneShot: false,
          maxUses: 16,
        });

        filmStockStore.put({ id: sampleStockId, name: "Kentmere 400" });
        developmentRecipeStore.put({
          id: crypto.randomUUID(),
          name: "Monobath Df96 - Intermittent Agitation",
          filmstock_id: sampleStockId,
          steps: [
            {
              id: crypto.randomUUID(),
              initialAgitation: 30,
              agitationTime: 4,
              agitationIntervals: 60,
              chemistry_id: sampleChemId,
              temp: 75,
              duration: 240,
            },
          ],
        });
      }
      if (event.oldVersion < 2) {
        console.log("Upgrading db to version 2");
        const filmstockStore = request.transaction.objectStore("film-stocks");
        filmstockStore.createIndex("by_id", "id");
      }
      if (event.oldVersion < 3) {
        console.log("Upgrading db to version 3");

        // Seed database with core data
        // for now this is water.
        const chemistryRecipeStore =
          request.transaction.objectStore("chemistry-recipes");
        chemistryRecipeStore.put({
          id: "_WATER_",
          name: "Water",
        });
      }
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
    const formattedIndexValue = String(indexValue);

    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.get(formattedIndexValue);

    request.onsuccess = function () {
      if (request.result) {
        resolve(request.result);
      } else {
        reject(
          new Error(
            `No item found with index ${formattedIndexValue} in ${indexName}`,
          ),
        );
      }
    };

    request.onerror = function (event) {
      reject(new Error(`Error fetching item: ${event.target.errorCode}`));
    };
  });
}

export function getAllFromStore(
  db,
  storeName,
  indexName = null,
  indexValue = null,
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

    const request = store.put(object);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export function deleteObjectFromStore(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    const request = store.delete(key);

    request.onsuccess = function () {
      resolve();
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

// TODO: This function currently only works with items with 1 level of dependency for deletions
// ie: Chems delete Mixes, Stocks delete recipes, but if a recipe needed to delete a mix, it
// wouldn't work it doesnt, but just as an example.
export function deleteObjectAndDependentsFromStore(
  db,
  storeName,
  key,
  dependentStores,
  // dependent stores should be an object that
  // has a key of the store name and a value of the index name
  // eg { "development-recipes": "filmstock_id"}
) {
  return new Promise(async (resolve, reject) => {
    const tx = db.transaction(
      [storeName, ...Object.keys(dependentStores)],
      "readwrite",
    );

    // Handle errors for the transaction
    tx.onerror = (event) => reject(tx.error);
    tx.oncomplete = () => resolve();

    // Process each dependent store
    for (const [dependentStoreName, indexName] of Object.entries(
      dependentStores,
    )) {
      const store = tx.objectStore(dependentStoreName);
      const index = store.index(indexName);
      const request = index.openCursor(IDBKeyRange.only(key));

      request.onsuccess = async () => {
        const cursor = request.result;
        if (cursor) {
          // Delete the dependent object
          const deleteRequest = cursor.delete(); // Deletes the current record
          deleteRequest.onerror = (event) => {
            reject(deleteRequest.error);
            return;
          };

          cursor.continue();
        }
      };
    }

    // After handling all dependencies, delete the original item
    const originalStore = tx.objectStore(storeName);
    const deleteOriginalRequest = originalStore.delete(key);
    deleteOriginalRequest.onerror = (event) => {
      reject(deleteOriginalRequest.error);
    };
  });
}
