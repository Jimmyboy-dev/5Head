import { useEffect, useState, createContext } from "react";

// const nodeCGStatus = createContext()
// const dbPromise = window.db?.read() || Promise.reject("No database")
// export const useDB = () => {
//   dbPromise.catch((err) => {
//     console.error(err)
//     return
//   })
//   if (!window.db) {
//     return { data: null, set: () => {} }
//   }
//   const [db, setDB] = useState(window.db.data)
//   useEffect(() => {
//     window.db.data = db
//     window.db.write()
//   }, [db])
//   return { data: db, set: setDB }
// }
const currStatus: NodeCGStatus = await window.api.nodecg.status();
export const useNodeCGStatus = () => {
  const [status, setStatus] = useState(currStatus);
  useEffect(() => {
    const getStatus = async function () {
      setStatus(await window.api.nodecg.status());
    };
    getStatus();
  });
  return status;
};

const hooks = {
  // useDB,
  useNodeCGStatus,
};

export default hooks;
