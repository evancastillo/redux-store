export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open db connection
    const request = window.indexedDB.open('shop-shop', 1);

    // vars for database, transacton and object store
    let db, tx, store;

    // if new or version updated...
    request.onupgradeneeded = function (e) {
      const db = request.result;

      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    request.onerror = function (e) {
      console.log('There was an error');
    };

    // db open, so set up transaction handling
    request.onsuccess = function (e) {
      db = request.result;

      // create a transaction on the given store (products, categories, cart)
      tx = db.transaction(storeName, 'readwrite');

      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.log('error', e);
      };

      // execute the appropriate transaction
      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}