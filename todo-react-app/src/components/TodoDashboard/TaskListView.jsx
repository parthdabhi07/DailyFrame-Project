import React from "react";
import TodoRow from "./TodoRow";
import { useAccess } from "../../context/AccessContext";
import { executeGetAllListService, executeGetAllTodoInListService } from "../../api/TodoApiService";
import { useEffect } from "react";
import { useUserDashboard } from "../../context/UserDashboardContext";
import { useAuth } from "../../context/Security/AuthContext";

function TaskListView() {
  const { access } = useAccess();
  console.log("Rendering TaskListView with access:", access);
  const { setTodosFormate } = useUserDashboard();
  const AuthContext = useAuth();
  const userDashboardContext = useUserDashboard();
  const { taskList } = userDashboardContext;

  // Fetch todos for task lists
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await executeGetAllListService();
        if (response.status === 200) {
          const list = response.data.find((item) => item.listId === access[0]);
          if (list) {
            const formattedTodos = list.todos.map((todo) => ({
              id: todo.todoId,
              description: todo.description,
              status: todo.status,
              targetDate: todo.targetDate,
            }));
            setTodosFormate(formattedTodos);
          }
        } else {
          console.error("Error fetching todos for the list");
        }
      } catch (error) {
        console.error("Error in fetchTodos:", error);
      }
    };
    
    fetchTodos();
  }, [access, AuthContext.user.email]);
  
  // Fetch todos for task lists
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await executeGetAllTodoInListService(access[0]);
        if(response.status === 200) {
          const formattedTodos = response.data.map((todo) => ({
            id: todo.todoId,
            description: todo.description,
            status: todo.status,
            targetDate: todo.targetDate,
          }));
          setTodosFormate(formattedTodos);
        } else {
          console.log("Error fetching todos for the list");
        }
      } catch (error) {
        console.log("Error in fetchTodos:", error);
      }
    }
  }, [access, setTodosFormate]);
  
  return (
    <>
      <div className="content-header">
        <div className="header-center">
          <h1>{taskList.find((task) => task.id === access[0]).name}</h1>
        </div>
        {/* <div className="content-description">
          <h1>{"List "+ access[0]}</h1>
        </div> */}
      </div> 

      <div className="dashboard-content">
        <div className="todo-container">
          <div className="todo-header todo-header-list">
            <div className="todo-cell">Is Done?</div>
            <div className="todo-cell">Description</div>
            <div className="todo-cell">Target Date</div>
            <div className="todo-cell">Actions</div>
          </div>

          <TodoRow />
        </div>
      </div>
    </>
  );
}

export default React.memo(TaskListView);
