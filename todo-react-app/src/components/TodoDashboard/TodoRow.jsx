import React, { useEffect, useState } from "react";
import TodoForm from "./TodoForm";
import AddTaskForm from "./AddTaskForm";
import { useAccess } from "../../context/AccessContext";
import { checkAccessIsMyRoutin } from "../../utils/format";
import { useUserDashboard } from "../../context/UserDashboardContext";
import { executeGetAllListService } from "../../api/TodoApiService";
import { useAuth } from "../../context/Security/AuthContext";

function TodoRow() {
  console.log("Rendering TodoRow");
  const { access } = useAccess();
  const { myRoutinFormate, todosFormate } = useUserDashboard();
  const [todos, setTodos] = useState([]);

  // Update todos based on access
  useEffect(() => {
    if (checkAccessIsMyRoutin(access)) {
      setTodos(myRoutinFormate);
    } else {
      setTodos(todosFormate);
    }
  }, [access, myRoutinFormate, todosFormate]);

  return (
    <>
      <AddTaskForm setTodos={setTodos} />
      {todos
      .sort((a, b) => a.id - b.id) // Sort tasks based on their id
      .map((todo, index) => (
        <TodoForm
          key={todo.id}
          todo={todo}
          index={todo.id}
          setTodos={setTodos}
        />
      ))}
    </>
  );
}

export default React.memo(TodoRow);
