import React from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Register = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [uid, setUID] = useState("");
  const [gotten, setGotten] = useState(false);

  onSnapshot(collection(db, "utils"), (snapshot) => {
    setGotten(snapshot.docs[0].data().isGotten);
    setUID(snapshot.docs[0].data().currentUID);
  });

  const handleAdd = async (id, name) => {
    let data = {
      id,
      uid,
      name,
    };
    let result = await axios.post(
      `https://rfid-server.vercel.app/${role}/create`,
      data,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(result);
    setId("");
    setName("");
  };
  return (
    <div className="pt-12 pl-12">
      <h1 className="text-3xl font-bold mb-3">Register</h1>
      <label for="id" className="font-bold">
        Fill in the infomation:
      </label>
      <div className="pt-2">
        <div>
          <label htmlFor="">ID: </label>
          <input
            value={id}
            type="text"
            name=""
            id=""
            className="border-2 border-black"
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="pt-2">
          <label htmlFor="">Name: </label>
          <input
            value={name}
            type="text"
            name=""
            id=""
            className="border-2 border-black"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="pt-2">
          <label htmlFor="">Role: </label>
          <div>
            <input
              type="radio"
              id="age1"
              name="age"
              value="student"
              onClick={(e) => setRole(e.target.value)}
            />
            <label for="age1" className="pl-2">
              Student
            </label>
            <br />
            <input
              type="radio"
              id="age2"
              name="age"
              value="lecturer"
              onClick={(e) => setRole(e.target.value)}
            />
            <label for="age2" className="pl-2">
              Lecturer
            </label>
            <br />
          </div>
        </div>
        <div className="font-bold">
          {!gotten ? "Scan RFID to add" : `Gotten UID ${uid}`}
        </div>
        <button
          className={
            "border border-black mt-2 px-1 hover:bg-red-500 " +
            (!gotten ? "cursor-not-allowed" : "")
          }
          disabled={!gotten}
          onClick={() => handleAdd(id, name)}
        >
          Add to database
        </button>
      </div>
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

export default Register;
