import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { SongType } from "../types";
import { db } from "./firebase";

export const getAllSongs = async () => {
  const ref = collection(db, "Songs");

  const snapshot = await getDocs(ref);
  const songsData: any = [];

  snapshot.forEach((doc) => {
    songsData.push({ id: doc.id, ...doc.data() });
  });

  return { songsData };
};

export const createUser = async (uid: string, data: any) => {
  if (!uid) return;
  return await setDoc(
    doc(db, "Users", uid),
    {
      uid,
      ...data,
    },
    {
      merge: true,
    }
  );
};
