import { createContext, useContext, useState } from "react";
import { useAuth } from "./Security/AuthContext";
import { executeGetAllListService, executeGetUserDashboardService } from "../api/TodoApiService";
import { useAccess } from "./AccessContext";

// 1. create a context
export const UserDashboardContext = createContext();
// 4. Create a custom hook to use the context - easy to use across the application!
export const useUserDashboard = () => {
  return useContext(UserDashboardContext); 
};
// 2. Share the created context with other (children) components
export default function UserDashboardProvider({ children }) {
  // 3. Put some state in the context

  const AuthContext = useAuth();
  const { access } = useAccess();
  const [taskList, setTaskList] = useState([""]);
  const [myRoutinFormate, setMyRoutinFormate] = useState([]);
  const [todosFormate, setTodosFormate] = useState([]);

  async function getUserDashboard() {
    try {
      const response = await executeGetUserDashboardService();

      if (response.status === 200) {
        // Navbar
        AuthContext.setUser({
          ...AuthContext.user,
          username: response.data.username,
        });

        // Sidebar
        const arr = response.data.lists.map((list) => ({
          id: list.listId,
          name: list.listName,
        }));
        setTaskList(arr);
        console.log("Task List ", arr);

        // TodoDashboard
        setMyRoutinFormate(response.data.myRoutine.map((item) => ({
          id: item.routineId,
          title: item.title,
          description: item.description,
          startTime : item.startTime,
          endTime : item.endTime,
          status: item.status,
        })));
        console.log("Todo Format ", response.data.myRoutine.map((item) => ({
          id: item.routineId,
          title: item.title,
          description: item.description,
          startTime : item.startTime,
          endTime : item.endTime,
          status: item.status,
        })));

        console.log("User Dashboard Data ", response.data);
        return response.data;
      } else {
        console.log("Error fetching user dashboard data");
        return null;
      }
    } catch (error) {
      console.log("Error in UserDashboardProvider", error);
    }
  }

  return (
    <UserDashboardContext.Provider
      value={{
        getUserDashboard, 
        taskList, 
        setTaskList,
        myRoutinFormate,
        setMyRoutinFormate,
        todosFormate,
        setTodosFormate,
        
      }}
    >
      {children}
    </UserDashboardContext.Provider>
  );
}