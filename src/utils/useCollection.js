import { useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

export const useCollection = (collectionRef) => {
  const [collectionData, setCollectionData] = useState([]);
  useEffect(() => {
    console.log("useCollection");
    onSnapshot(collectionRef, (snap) => {
      setCollectionData(
        snap.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });
  }, []);
  return collectionData;
};
