import React, { useState, useEffect } from "react";
import "./TodoDashboard.css";
import MyRoutin from "./MyRoutin";
import TaskListView from "./TaskListView"
import { useAccess } from "../../context/AccessContext";
import { checkAccessIsMyRoutin, checkAccessIsTaskList } from "../../utils/format";

function TodoDashboard() {

  const { access } = useAccess();

  console.log("Rendering TodoDashboard");

  return (
    <>
      {checkAccessIsMyRoutin(access) && <MyRoutin />} 
      {checkAccessIsTaskList(access) && <TaskListView />}
    </>
  );
}

export default React.memo(TodoDashboard);