import Nav from "./components/Nav";
import { Route, Routes } from "react-router-dom";
import Attendance from "./containers/Attendance.jsx";
import Register from "./containers/Register.jsx";
import Update from "./containers/Update.jsx";
import Delete from "./containers/Delete.jsx";
import Detail from "./containers/Detail.jsx";
import EmptyDB from "./containers/EmptyDB.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Manage from "./containers/Manage";

function App() {
  return (
    <div className="h-auto relative">
      <Nav></Nav>
      <Routes>
        <Route path="/attendance" element={<Attendance />} />
        {/* <Route path="/manage" element={<Manage />} /> */}
        <Route path="/register" element={<Register />} />
        {/* <Route path="/update" element={<Update />} /> */}
        {/* <Route path="/delete" element={<Delete />} /> */}
        <Route path="/detail" element={<Detail />} />
        <Route path="/emptydb" element={<EmptyDB />} />
      </Routes>
    </div>
  );
}

export default App;
