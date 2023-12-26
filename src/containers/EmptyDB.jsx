import React from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { data } from "../utils/data";
import { ToastContainer, toast } from "react-toastify";

const EmptyDB = () => {
  const emptyDB = async () => {
    try {
      (await getDocs(collection(db, "lecturer"))).docs.forEach(async (item) => {
        await deleteDoc(item.ref);
      });
      (await getDocs(collection(db, "student"))).docs.forEach(async (item) => {
        await deleteDoc(item.ref);
      });
    } catch (error) {
      console.error("Error emptying the database:", error);
    }
  };

  const addTestDB = async () => {
    data.forEach(async (emp) => {
      await addDoc(collection(db, "student"), {
        id: emp.id,
        name: emp.name,
        uid: emp.uid,
      });
    });
    await addDoc(collection(db, "lecturer"), {
      id: "GV001",
      name: "Thầy Ahihi",
      uid: "q3 y6 u8 i9",
    });
  };

  return (
    <div className="pt-12 pl-12">
      <button
        className={"border border-black mt-2 px-1 ml-2 hover:bg-red-500 "}
        onClick={() => {
          toast.promise(emptyDB, {
            loading: "Loading",
            success: "Empty DB success",
            error: "Error when fetching",
          });
        }}
      >
        Empty database
      </button>
      <button
        className={"border border-black mt-2 px-1 ml-2 hover:bg-red-500 "}
        onClick={() => {
          toast.promise(addTestDB, {
            loading: "Loading",
            success: "Adding data success",
            error: "Error when fetching",
          });
        }}
      >
        Add test database
      </button>
      <ToastContainer
        position="bottom-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default EmptyDB;
