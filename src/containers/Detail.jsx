import React, { useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import BarChart from "../components/BarChart.jsx";

const convertHourStringToSecond = (time) => {
  let a = time.split(":");
  let second = parseInt(a[0]) * 3600 + parseInt(a[1]) * 60 + parseInt(a[2]);
  return second;
};

const AttendTable = ({ month, year, attendance }) => {
  const rows = [];
  const have30days = [4, 6, 9, 11];
  let days;
  if (month == 2) {
    days = 28;
  } else if (have30days.includes(parseInt(month))) {
    days = 30;
  } else {
    days = 31;
  }
  const monthStr = month < 10 ? "0" + month : month + "";
  for (let i = 1; i <= days; i++) {
    rows.push(<th className="border border-black px-2">{i}</th>);
  }
  const empRows = [];
  let daywork = [];
  let keys = Object.keys(attendance) || {};
  for (let j = 1; j <= days; j++) {
    daywork.push(
      <th style={{ border: "1px solid black" }}>
        {keys.includes(`${j < 10 ? "0" + j : j}/${monthStr}/${year}`)
          ? "X"
          : " "}
      </th>
    );
  }
  return (
    <div className="">
      <h1 className="font-bold text-xl mb-1 text-red-600">
        Tháng {month}, năm {year}
      </h1>
      <table>
        <thead>
          <tr>{rows}</tr>
        </thead>
        <tbody>
          <tr>{daywork}</tr>
        </tbody>
      </table>
    </div>
  );
};

const Table = ({ employees, month, year, setModal, setModalContent }) => {
  const changeContent = (employee, month, year) => {
    setModalContent({
      employee,
      month,
      year,
    });
    setModal(true);
  };
  let excelData = [];
  const have30days = [4, 6, 9, 11];
  let days;
  if (month == 2) {
    days = 28;
  } else if (have30days.includes(parseInt(month))) {
    days = 30;
  } else {
    days = 31;
  }

  const empRows = [];
  let moneyNeedToPayForEmp = 0;
  let employeeLabel = [];
  let employeeData = [];
  for (let i = 0; i < employees.length; i++) {
    let excelRow = {
      stt: i + 1,
      id: employees[i].id,
      name: employees[i].name,
    };
    excelRow;
    let keys = Object.keys(employees[i].attendance || {});
    let totalMoney = 0;
    let workedHours = 0;
    let workedDay = 0;

    if (!keys) {
      empRows.push(
        <>
          <td className="border border-black px-2"> </td>
          <td className="border border-black px-2"> </td>
          <td className="border border-black px-2"> </td>
        </>
      );
      continue;
    }
    keys.forEach((day) => {
      let workedHoursInDay = 0;
      if (
        parseInt(day.slice(3, 5)) == month &&
        parseInt(day.slice(6, 10)) == year
      ) {
        employees[i].attendance[day].forEach((time, index) => {
          if (index % 2) {
            workedHoursInDay += convertHourStringToSecond(time);
          } else {
            workedHoursInDay -= convertHourStringToSecond(time);
          }
        });
        if (employees[i].attendance[day].length % 2) {
          workedHoursInDay += convertHourStringToSecond(
            employees[i].attendance[day][
              employees[i].attendance[day].length - 1
            ]
          );
        }
        workedHours += workedHoursInDay;
        workedDay++;
      }
    });
    employeeLabel.push(employees[i].name);
    employeeData.push(Math.floor(workedHours / 3600));
    totalMoney = Math.floor(workedHours / 3600) * 20000;
    moneyNeedToPayForEmp += totalMoney;

    excelRow.workedDay = workedDay;
    excelRow.notWorkedDay = days - workedDay;
    excelRow.workedHours = Math.floor(workedHours / 3600);
    excelRow.salary = totalMoney;
    excelData.push(excelRow);

    empRows.push(
      <>
        <td className="border border-black px-2">{workedDay}</td>
        <td className="border border-black px-2">{days - workedDay}</td>
        <td className="border border-black px-2">
          {Math.floor(workedHours / 3600)}
        </td>
        <td className="border border-black px-2">
          {totalMoney.toLocaleString()} VND
        </td>
      </>
    );
  }
  return (
    <div className="grid grid-cols-12 pb-8">
      <div className="col-span-7">
        <h1 className="font-bold text-xl pb-2 text-red-600">
          Bảng chấm công tháng {month}, năm {year}
          <CSVLink
            data={excelData}
            filename={`bangchamcong_${month}-${year}`}
            className="bg-green-600 ml-4 text-white px-2 py-1 rounded font-bold text-base hover:bg-green-700"
          >
            <i class="fa-solid fa-file-arrow-down mr-2"></i>
            Export
          </CSVLink>
        </h1>
        <table>
          <thead>
            <tr>
              <th className="border border-black px-2">ID</th>
              <th className="border border-black px-2">Name</th>
              <th className="border border-black px-2">Work days</th>
              <th className="border border-black px-2">Not work days</th>
              <th className="border border-black px-2">Work hours</th>
              <th className="border border-black px-2">Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => {
              return (
                <tr
                  key={employee.id}
                  id={employee.id}
                  className={
                    (index % 2 ? "bg-slate-300" : "") +
                    " hover:bg-cyan-300 cursor-pointer transition-all duration-300"
                  }
                  onClick={() => changeContent(employee, month, year)}
                >
                  <td className="border border-black px-2">{employee.id}</td>
                  <td className="border border-black px-2">{employee.name}</td>
                  {empRows[index]}
                </tr>
              );
            })}
          </tbody>
        </table>
        <h1 className="pt-3">
          Tổng tiền lương phải trả nhân viên tháng này:{" "}
          {moneyNeedToPayForEmp.toLocaleString()} VND
        </h1>
      </div>
      <div className="col-span-5 pl-2 pt-10 flex flex-col items-center">
        <BarChart data={employeeData} label={employeeLabel} />
        <h1 className="pt-3">
          Biểu đồ giờ làm nhân viên tháng {month}/{year}
        </h1>
      </div>
    </div>
  );
};

const Checkin = ({ employee, month, year }) => {
  let keys = Object.keys(employee.attendance || {});
  let rows = [];
  keys.sort();
  keys.forEach((day) => {
    if (day.slice(3, 5) == month && day.slice(6, 10) == year) {
      let hour = [];
      for (let i = 0; i < 16; i++) {
        hour.push(
          <td className="border border-black px-2">
            {employee.attendance[day][i] || ""}
          </td>
        );
      }
      rows.push(
        <tr key={day}>
          <th className="border border-black px-2">{day}</th>
          {hour}
        </tr>
      );
    }
  });
  return (
    <div>
      <table className="">
        <thead>
          <tr>
            <th className="border border-black px-2"></th>
            <th className="border border-black px-2">In 1</th>
            <th className="border border-black px-2">Out 1</th>
            <th className="border border-black px-2">In 2</th>
            <th className="border border-black px-2">Out 2</th>
            <th className="border border-black px-2">In 3</th>
            <th className="border border-black px-2">Out 3</th>
            <th className="border border-black px-2">In 4</th>
            <th className="border border-black px-2">Out 4</th>
            <th className="border border-black px-2">In 5</th>
            <th className="border border-black px-2">Out 5</th>
            <th className="border border-black px-2">In 6</th>
            <th className="border border-black px-2">Out 6</th>
            <th className="border border-black px-2">In 7</th>
            <th className="border border-black px-2">Out 7</th>
            <th className="border border-black px-2">In 8</th>
            <th className="border border-black px-2">Out 8</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

const Modal = ({ modal, setModal, employee, month, year }) => {
  let keys = Object.keys(employee);
  keys.sort();
  keys.reverse();
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-25">
      <div className="bg-white rounded-3xl w-5/6 h-[500px] absolute left-1/2 -translate-x-1/2 top-20">
        <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-6 overflow-scroll overflow-x-hidden">
          <div
            className="inline-block float-right opacity-30 hover:opacity-100"
            onClick={() => setModal(!modal)}
          >
            <div className="font-bold cursor-pointer text-2xl ">X</div>
          </div>
          <h1 className="font-bold text-2xl mb-4">Employee Infomation</h1>
          <div className="flex gap-4">
            <div
              style={{
                backgroundImage: `url(${employee.image})`,
              }}
              className="h-36 bg-no-repeat bg-cover bg-center aspect-[16/20]"
            ></div>
            <div className="inline-block">
              <h1 className="inline-block pr-3">
                <span className="font-bold">id: </span> {employee.id}
              </h1>
              <br />
              <h1 className="inline-block pr-3">
                <span className="font-bold">name: </span> {employee.name}
              </h1>
              <br />
              {keys.map((field) => {
                return (
                  field != "id" &&
                  field != "name" &&
                  field != "fingerprintId" &&
                  field != "image" &&
                  field != "attendance" && (
                    <>
                      <h1 className="inline-block pr-3">
                        <span className="font-bold">{field}: </span>{" "}
                        {employee[field] || "null"}
                      </h1>
                      <br />
                    </>
                  )
                );
              })}
            </div>
          </div>

          <h1 className="font-bold text-2xl mb-2 mt-4">Attend</h1>
          <AttendTable
            month={month}
            year={year}
            attendance={employee.attendance || {}}
          />
          <h1 className="font-bold text-2xl mb-2 mt-4">Checkin</h1>
          <Checkin employee={employee} month={month} year={year} />
        </div>
      </div>
    </div>
  );
};

const Detail = () => {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState("");

  const fetchData = async () => {
    const employeeData = (
      await getDocs(query(collection(db, "student"), orderBy("id")))
    ).docs.map((doc) => doc.data());
    setEmployees(employeeData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dateNow = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  let a = parseInt(dateNow.slice(3, 5));
  let b = parseInt(dateNow.slice(6, 10));
  let c, d, e, f;
  if (a == 1) {
    c = 12;
    e = 11;
    f = d = b - 1;
  } else if (a == 2) {
    c = 1;
    e = 12;
    d = b;
    f = parseInt(b) - 1;
  } else {
    c = parseInt(a) - 1;
    e = parseInt(a) - 2;
    d = f = b;
  }

  return (
    <>
      <div className="pb-8 w-full px-12 absolute top-0 pt-24">
        <h1 className="text-3xl font-bold mb-3">Detail</h1>

        {modal && (
          <Modal
            modal={modal}
            setModal={setModal}
            employee={modalContent.employee}
            month={modalContent.month}
            year={modalContent.year}
          />
        )}

        <Table
          employees={employees}
          month={a}
          year={b}
          modal={modal}
          setModal={setModal}
          setModalContent={setModalContent}
        />
        <Table
          employees={employees}
          month={c}
          year={d + ""}
          modal={modal}
          setModal={setModal}
          setModalContent={setModalContent}
        />
        <Table
          employees={employees}
          month={e}
          year={f}
          modal={modal}
          setModal={setModal}
          setModalContent={setModalContent}
        />
      </div>
    </>
  );
};

export default Detail;
