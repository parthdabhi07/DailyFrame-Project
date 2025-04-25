import React, { useState, useCallback } from "react";
import Watchicon from "../../assets/stopwatch.svg";
import Listicon from "../../assets/list-check.svg";
import { useAccess } from "../../context/AccessContext";
import { useUserDashboard } from "../../context/UserDashboardContext";
import { useAuth } from "../../context/Security/AuthContext";
import { executeAddNewListService } from "../../api/TodoApiService";

function Sidebar({ setActive, active }) {
  const [taskListOpen, setTaskListOpen] = useState(true);
  const [newTask, setNewTask] = useState("");
  // const [taskList, setTaskList] = useState(["Collage", "School", "Office", "Home"]);
  const { setAccess } = useAccess();
  const userDashboardContext = useUserDashboard();
  const { taskList, setTaskList } = userDashboardContext;
  const AuthContext = useAuth();

  const handleActive = useCallback(() => {
    setActive({
      myRoutin: true,
      myTaskList: false,
      addTask: false,
    });
  }, [setActive]);

  const handleNewTask = useCallback(async () => {
    if (newTask.trim() === "") return;

    // handling post to add new list
    try {
      const response = await executeAddNewListService(AuthContext.user.email, newTask);
      if (response.status === 200) {
        console.log("New task added successfully:", response.data);
        setTaskList((prevTaskList) => [
          ...prevTaskList,
          {
            id: response.data.listId,
            name: response.data.listName,
          },
        ]);
        setNewTask(""); // Clear input field
        setTaskListOpen(true); // Ensure the task list is open
      } else {
        console.log("Error adding new task:", response);
      }
    } catch (error) {
      console.log("Failed to add task:", error);
    }
  }, [newTask, taskList, AuthContext.user.email]);

  // const handleNewTask = useCallback(async () => {
  //   if (newTask.trim() === "") return;

  //   try {
  //     if (response.status === 200) {
  //       console.log("New task added successfully:", response.data);
  //       setTaskList((prevTaskList) => [...prevTaskList, response.data]); // Add new task from backend
  //       setNewTask(""); // Clear input field
  //       setTaskListOpen(true); // Ensure the task list is open
  //     } else {
  //       console.error("Error adding new task:", response);
  //     }
  //   } catch (error) {
  //     console.error("Failed to add task:", error);
  //   }
  // }, [newTask, setTaskList, AuthContext.user.email]);

  const handleInputChange = useCallback(
    (e) => {
      setNewTask(e.target.value);
      setActive({
        myRoutin: false,
        myTaskList: false,
        addTask: true,
      });
    },
    [setActive]
  );

  const handleTaskList = useCallback(() => {
    setTaskListOpen(!taskListOpen);
    setActive({
      myRoutin: false,
      myTaskList: true,
      addTask: false,
    });
  }, [taskListOpen, setActive]);

  // without using useCallback hook, the function will be re-created on every render.
  // useCallback is used to memoize the function so that it will not be re-created on every render.

  // const memoizedCallback = useCallback(() => {
  //   // Your callback function logic
  // }, [dependency1, dependency2, ...]);

  // const handleTaskList = () => {
  //   setTaskListOpen(!taskListOpen);
  //   setActive({
  //     myRoutin: false,
  //     myTaskList: true,
  //     addTask: false,
  //   });
  // };

  // OLD - HANDLE ACCESS CLICK : RE-RENDERING EVERY TIME WHEN CLICK ISSUE

  // const handleAccessClick = useCallback(
  //   (access)=>{setAccess([access]);}, [setAccess]
  // );

  const handleAccessClick = useCallback(
    (access) => {
      setAccess((prevAccess) => {
        if (prevAccess[0] !== access) {
          return [access];
        }
        return prevAccess; // "Avoid updating state if the value is the same"
      });
    },
    [setAccess]
  );

  return (
    <>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <ul className="nav-list">
            <li
              className={`nav-item  ${active.myRoutin ? "active" : ""}`}
              onClick={handleActive}
              style={{ cursor: "pointer" }}
              key={"myRoutin"}
            >
              <a
                className="nav-link"
                onClick={() => handleAccessClick("My Routin")}
              >
                <WatchIcon />
                <span style={{ cursor: "pointer" }}>My Routin</span>
              </a>
            </li>
            <li
              className={`nav-item  ${active.myTaskList ? "active" : ""}`}
              key={"myTaskList"}
            >
              <button className="nav-link list-btn" onClick={handleTaskList}>
                <ListIcon />
                <span>My Task List</span>
                <span className="up-down-icon">
                  {taskListOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </span>
              </button>

              {taskListOpen && (
                <ul className={`task-list`}>
                  {taskList
                    .sort((a, b) => a.id - b.id) // Sort tasks based on their id
                    .map((task) => (
                      <li
                        className="task-item"
                        key={task.id - 1}
                        onClick={() => handleAccessClick(task.id)}
                      >
                        <a className="task-link">
                          <span>{task.name}</span>
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </li>

            <li
              className={`nav-item  ${active.addTask ? "active" : ""}`}
              key={"addTask"}
            >
              <span className="nav-link add-task">
                <span>
                  <AddIcon />
                </span>
                <span className="add-task-form">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent form submission
                      handleNewTask(); // Call the function to add a new task
                    }}
                  >
                    <input
                      type="text"
                      name="newtask"
                      id="newtask"
                      placeholder="Add new task!"
                      value={newTask}
                      onChange={handleInputChange}
                      required
                    />
                    <button className="add-btn" type="submit">
                      Add
                    </button>
                  </form>
                </span>
              </span>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

// icons
const { WatchIcon, ListIcon, ChevronUpIcon, ChevronDownIcon, AddIcon } =
  newFunction();

function newFunction() {
  const WatchIcon = () => (
    <img
      src={Watchicon}
      alt=""
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="currentColor"
    />
  );

  const ListIcon = () => (
    <img
      src={Listicon}
      alt=""
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="currentColor"
    />
  );

  const ChevronUpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </svg>
  );

  const AddIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  );
  return { WatchIcon, ListIcon, ChevronUpIcon, ChevronDownIcon, AddIcon };
}

export default React.memo(Sidebar);
