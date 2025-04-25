("use client");
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import TodoDashboard from "../components/TodoDashboard/TodoDashboard";
import Footer from "../components/Footer/Footer";
import { useAccess } from "../context/AccessContext";
import { useUserDashboard } from "../context/UserDashboardContext";

function Dashboard() {
 
  const [active, setActive] = useState({
      myRoutin: false,
      myTaskList: false,
      addTask: false,
    });
    
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selctItemInSidebar, setSelctItemInSidebar] = useState("My Routin");
    const [confirmedRefresh, setConfirmedRefresh] = useState(false);
    // const [access , setAccess] = useState(["My Routin"]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const userDashboardContext = useUserDashboard();
  
  useEffect(() => {
    userDashboardContext.getUserDashboard();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!confirmedRefresh) {
        const message = "Are you sure you want to refresh? You will be logged out.";
        event.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [confirmedRefresh]);

  useEffect(() => {
    const handleUnload = () => {
      if (confirmedRefresh) {
        // Logic to log out the user
        console.log("User logged out");
      }
    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [confirmedRefresh]);

  return (
    <>
      <div className="dashboard-layout">
        {/* Header */}
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="content-wrapper">
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <Sidebar setActive={setActive} active={active} />
          </aside>

          {/* Main Content */}
          <main className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
            <TodoDashboard setActive={setActive} active={active} />
          </main>
        </div>
      </div>
    </>
  );
}

export default React.memo(Dashboard);