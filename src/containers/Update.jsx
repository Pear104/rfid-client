import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { ToastContainer, toast } from "react-toastify";

const UpdateInput = ({ updateInfo, setUpdateInfo, field, title }) => {
  return (
    <div>
      <h1 className="pt-3 inline-block mr-2">{title}</h1>
      <input
        value={updateInfo[field] || ""}
        type="text"
        name=""
        id=""
        className="border-black border"
        onChange={(e) => {
          console.log(updateInfo);
          setUpdateInfo({
            ...updateInfo,
            [field]: e.target.value,
          });
        }}
      />
    </div>
  );
};

const Update = () => {
  const [gotten, setGotten] = useState(true);
  const [getting, setGetting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({});
  const [updateId, setUpdateId] = useState("");
  const [popup, setPopup] = useState(false);

  const fetchData = async () => {
    const employeeData = (
      await getDocs(query(collection(db, "employees"), orderBy("id")))
    ).docs.map((doc) => doc.data());
    setEmployees(employeeData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (gotten && popup) {
      toast.success("Update new fingerprint success");
    }
  }, [gotten]);

  const optionHandleChange = async (id) => {
    if (!selected) {
      setSelected(true);
    }
    setUpdateId(id);
    setUpdateInfo(
      (
        await getDocs(query(collection(db, "employees"), where("id", "==", id)))
      ).docs[0].data()
    );
  };

  const updateEmployee = async () => {
    const sqlResult = (
      await getDocs(
        query(collection(db, "employees"), where("id", "==", updateId))
      )
    ).docs[0];
    await updateDoc(doc(db, "employees", sqlResult.id), {
      name: updateInfo.name || "",
      image: updateInfo.image || "",
      address: updateInfo.address || "",
      phoneNumber: updateInfo.phoneNumber || "",
      email: updateInfo.email || "",
    });

    const sqlResult2 = (await getDocs(query(collection(db, "utils")))).docs[0];
    await updateDoc(doc(db, "utils", sqlResult2.id), {
      isGotten: false,
    });

    setSelected(false);
    setGotten(false);
    fetchData();
  };

  onSnapshot(query(collection(db, "utils")), (snapshot) => {
    setGetting(snapshot.docs[0].data().isGettingFingerprint);
    setGotten(snapshot.docs[0].data().isGotten);
  });

  return (
    <div className="pt-12 pl-12">
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
      <h1 className="text-3xl font-bold mb-3">Update</h1>
      <label htmlFor="id" className="font-bold">
        Choose employee to update:{" "}
      </label>
      <select
        id="id"
        onClick={(e) => {
          optionHandleChange(e.target.value);
        }}
      >
        {employees.map((emp) => {
          return <option value={emp.id}>{emp.id}</option>;
        })}
      </select>
      <br />
      {selected && (
        <>
          <h1 className="text-red-500 font-bold text-2xl mt-1">
            Employee Info
          </h1>
          <UpdateInput
            updateInfo={updateInfo}
            setUpdateInfo={setUpdateInfo}
            field={"name"}
            title={"Name: "}
          />
          <UpdateInput
            updateInfo={updateInfo}
            setUpdateInfo={setUpdateInfo}
            field={"image"}
            title={"Image: "}
          />
          <UpdateInput
            updateInfo={updateInfo}
            setUpdateInfo={setUpdateInfo}
            field={"address"}
            title={"Address: "}
          />
          <UpdateInput
            updateInfo={updateInfo}
            setUpdateInfo={setUpdateInfo}
            field={"phoneNumber"}
            title={"Phone number: "}
          />
          <UpdateInput
            updateInfo={updateInfo}
            setUpdateInfo={setUpdateInfo}
            field={"email"}
            title={"Email: "}
          />
          <h1>
            Fingerprint: {updateInfo.fingerprintId}
            <button
              className="border border-black mt-2 ml-8 px-1 hover:bg-red-500"
              onClick={async () => {
                setPopup(true);
                const databaseState = (
                  await getDocs(query(collection(db, "utils")))
                ).docs[0];
                await updateDoc(doc(db, "utils", databaseState.id), {
                  updatingFingerprintId: updateInfo.fingerprintId,
                  isGotten: false,
                  isGettingFingerprint: true,
                });
                toast.info("Getting new fingerprint");
              }}
            >
              Update fingerprint
            </button>
          </h1>
          <button
            className={
              "border border-black mt-2 px-1 hover:bg-red-500 " +
              (!getting ? "" : "cursor-not-allowed")
            }
            onClick={() => {
              toast.promise(updateEmployee, {
                loading: "Loading",
                success: "Update success",
                error: "Error when fetching",
              });
            }}
            disabled={getting}
          >
            Update
          </button>
        </>
      )}
    </div>
  );
};

export default Update;
