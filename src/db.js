export function open() {
  return new Promise(function (resolve, reject) {
    let db;
    const request = indexedDB.open("database");

    request.onupgradeneeded = function () {
      // The database did not previously exist, so create object stores and indexes.
      db = request.result;
      const chemistryRecipeStore = db.createObjectStore("chemistry-recipes", { keyPath: "id" });
      const developmentRecipeStore = db.createObjectStore("development-recipes", {
        keyPath: "id",
      });
      developmentRecipeStore.createIndex("by_filmstock", "filmStockId");

      const filmStockStore = db.createObjectStore("film-stocks", { keyPath: "id" });
      chemistryRecipeStore.put({
        id: crypto.randomUUID(),
        name: "Rodinal 1:50",
        temp: "68F",
        notes: "123456",
        ratio: "1:50",
      });
      const sampleStockId =  crypto.randomUUID()
      filmStockStore.put({ id: sampleStockId, name: "Kentmere 400" });
      developmentRecipeStore.put({ id: crypto.randomUUID(), name: "Rodinal 1:50", filmStockId: sampleStockId });

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

export function getAllFromStore(db, storeName, indexName=null, indexValue=null) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    let index = null;
    let request = null;

    if (indexName) {
      index = store.index(indexName)
      request = index.openCursor(IDBKeyRange.only(indexValue))
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
