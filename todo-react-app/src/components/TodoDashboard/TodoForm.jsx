import React from "react";
import Editicon from "../../assets/pencil-square.svg";
import { set, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useState } from "react";
import { useAccess } from "../../context/AccessContext";
import { checkAccessIsMyRoutin, checkAccessIsTaskList } from "../../utils/format";
import { executeDeleteMyRoutineService, executeDeleteTodoService, executeUpdateMyRoutineService, executeUpdateTodoService } from "../../api/TodoApiService";

function TodoForm({ todo, index, setTodos }) {

  const { access } = useAccess();
  const [isDeliting, setIsDeliting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Set default values when component mounts
  useEffect(() => {
    setValue(`isDone-${index}`, todo.status);
    setValue(`description-${index}`, todo.description);
    if(checkAccessIsTaskList(access)){
      setValue(`targetDate-${index}`, todo.targetDate);
    } else {
      setValue(`title-${index}`, todo.title);
      setValue(`startTime-${index}`, todo.startTime);
      setValue(`endTime-${index}`, todo.endTime);
    }
  }, [setValue, todo, index]);

  const onSubmit = async (data, event) => {
    event.preventDefault(); // Prevent default form submission
    console.log(`start form ${index}`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const response = await (checkAccessIsMyRoutin(access) ? executeUpdateMyRoutineService(data, todo.id) : executeUpdateTodoService(data, todo.id));
      
      if(response.status === 200) {
        setTodos((prevTodos) => {
          const updatedTodos = prevTodos.map((item) => {
            if (item.id === index) { // Match the todo by its unique id
              // const response = executeUpdateMyRoutineService(data, item.id);
              if (checkAccessIsMyRoutin(access)) {
                return {
                  ...item,
                  status: data[`isDone-${index}`],
                  title: data[`title-${index}`],
                  description: data[`description-${index}`],
                  startTime: data[`startTime-${index}`],
                  endTime: data[`endTime-${index}`],
                };
              } else {
                return {
                  ...item,
                  status: data[`isDone-${index}`],
                  description: data[`description-${index}`],
                  targetDate: data[`targetDate-${index}`],
                };
              }
            }
            return item; // Return unchanged todos
          });
    
          console.log(`updating data form ${index}`, data);
          return updatedTodos;
        });
      } else {
        console.log("Error updating todo");
        // console.log(`updating data form ${index}`, data);
        
      }
    } catch (error) {
      console.log("Error in TodoForm onSubmit", error);
      // console.log(`updating data form ${index}`, data);
      
    }
  };

  const handleDelete = async () => {
    
    setIsDeliting(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const response = await (checkAccessIsMyRoutin(access) ? executeDeleteMyRoutineService(todo.id) : executeDeleteTodoService(todo.id));
      if (response.status === 200) {
        console.log("Message: ", response.data);
        // Creates a new array excluding the element at the specified index.
        setTodos((prevTodos) => prevTodos.filter((item) => item.id !== todo.id));
        setIsDeliting(false);
      } else {
        console.log("Error deleting todo");
        setIsDeliting(false);
        return;
      }
      console.log(`deleting form ${index}`);
    } catch (error) {
      console.log("Error deleting todo", error);
      setIsDeliting(false);
      return;
    }
  };

  return (
    <form key={index} className={`todo-row${checkAccessIsTaskList(access) ? '-list' : ""}`} onSubmit={handleSubmit(onSubmit)}>
      <div className="todo-cell is-done" data-label="Is Done">
        <input 
          type="checkbox" 
          className={`checkbox-isdone`}
          {...register(`isDone-${index}`)}
        />
      </div>
      {checkAccessIsMyRoutin(access) && 
        <div className="todo-cell" data-label="Title">
          <input
            type="text"
            className={`text-input${errors[`title-${index}`] ? "-error-border" : ""}`}
            {...register(`title-${index}`, { required: { value: true, message: 'title required!' } })}
            placeholder="Title*"
          />
        </div>
      }
      <div className="todo-cell" data-label="Description">
        <textarea
          className={`text-input${errors[`description-${index}`] ? "-error-border" : ""} text-area`}
          {...register(`description-${index}`, { required: { value: true, message: 'description required!' } })}
            placeholder="Description*"
        />
      </div>
      {checkAccessIsMyRoutin(access) && (
        <>
          <div className="todo-cell" data-label="Start Time">
            <input
              type="time"
              className={`time-bar${errors[`startTime-${index}`] ? "-error-border" : ""}`}
              {...register(`startTime-${index}`, { required: true })}
            />
          </div>
          <div className="todo-cell" data-label="End Time">
            <input
              type="time"
              className={`time-bar${errors[`endTime-${index}`] ? "-error-border" : ""}`}
              {...register(`endTime-${index}`, { required: true })}
            />
          </div>
        </>
      )}

      {checkAccessIsTaskList(access) && (
        <div className="todo-cell" data-label="Target Date">
          <input
            type="date"
            className={`time-bar${errors[`targetDate-${index}`] ? "-error-border" : ""}`}
            {...register(`targetDate-${index}`, { required: true })}
            min={new Date().toISOString().split("T")[0]} // Restrict to past dates including today
          />
        </div>
      )}

      <div className="todo-cell actions" data-label="Actions">
        <button className="save-icon submit-form-button" disabled={isSubmitting || isDeliting} title="Save" type="submit">
          <span>
            <SaveIcon />
          </span>
          <div>{isSubmitting ? "Saving..." : ""}</div>
        </button>
        <button className="delete-icon submit-form-button" disabled={isDeliting || isSubmitting} title="Delete" type="button" onClick={handleDelete}>
            <span>
              <DeleteIcon />
            </span>
            <div>{isDeliting ? "Deleting..." : ""}</div>
        </button>
      </div>
    </form>
  );
}

// icons
const { DeleteIcon, SaveIcon, UncheckIcon, CheckIcon } = newFunction();
function newFunction() {
  const DeleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      fill="#d0423e" // Change this color as needed
      viewBox="0 0 16 16"
      style={{ cursor: "pointer" }}
    >
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="#4f9d48"
      viewBox="0 0 16 16"
    >
      <path d="M11 2H9v3h2z"/>
      <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
    </svg>
  );

  const EditIcon = () => (
    <img
      src={Editicon}
      alt=""
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="currentColor"
    />
  );

  const UncheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="#4f9d48"
      viewBox="0 0 17 17"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="blue"
      viewBox="0 0 17 17"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
      <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
    </svg>
  );

  return { DeleteIcon, SaveIcon, UncheckIcon, CheckIcon };
}

export default React.memo(TodoForm);