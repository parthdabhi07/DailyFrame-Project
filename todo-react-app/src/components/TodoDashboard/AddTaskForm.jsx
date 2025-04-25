import React, { useEffect } from "react"; 
// import TodoRow from "./TodoRow";
import { useForm } from "react-hook-form";
import { useAccess } from "../../context/AccessContext";
import { checkAccessIsMyRoutin, checkAccessIsTaskList } from "../../utils/format";
import { executeAddNewTodoService, executeNewMyRoutineService } from "../../api/TodoApiService";
import { data } from "react-router-dom";

function AddTask({setTodos}) {

  const { access } = useAccess();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("data", data);
    try {
      const response = await (checkAccessIsMyRoutin(access) ? executeNewMyRoutineService(data) : executeAddNewTodoService(data, access[0]));

      if (response.status === 200) {
        console.log("New task added successfully:", response.data);
        if(checkAccessIsMyRoutin(access)){
          console.log("submitted data form", {...response.data, id : response.data.routineId});
          setTodos((prevTodos) => [...prevTodos, {...response.data, id : response.data.routineId}]); // Update the todos state with the new task
        } else {
          console.log("submitted data form", {...response.data, id : response.data.todoId});
          setTodos((prevTodos) => [...prevTodos, {...response.data, id : response.data.todoId}]); // Update the todos state with the new task
        }
        reset(); // Reset the form fields after successful submission
      } else {
        console.log("Error adding new task:", response.data);
      }
    } catch (error) {
      console.log("Failed to add task:", error);
    }
  };

  return (
    <>
      <form className={`todo-row${checkAccessIsTaskList(access) ? '-list' : ""} add-new`} onSubmit={handleSubmit(onSubmit)}>
        <div className="todo-cell is-done" data-label="Is Done">
          <span>---</span>
        </div>
        {checkAccessIsMyRoutin(access) && (
            <div className="todo-cell" data-label="Title">
              <input
                type="text"
                placeholder="Add New Title*"
                className={`text-input${errors.title ? "-error-border" : ""}`}
                {...register("title", {
                  required: { value: true, message: "titel required!" },
                })}
              />
              {/* {errors.title && <span className="error-msg">{errors.title.message}</span>} */}
          </div>
        )}
        <div className="todo-cell" data-label="Description">
          <textarea
            placeholder="Add New Description"
            className={`text-input${
              errors.description ? "-error-border" : ""
            } text-area`}
            {...register("description", {
              required: { value: true, message: "description required!" },
            })}
          />
          {/* {errors.description && <span className="error-msg">{errors.description.message}</span>} */}
        </div>
        {checkAccessIsMyRoutin(access) && (
          <>
            <div className="todo-cell" data-label="Start Time">
              <input
                type="time"
                className={`time-bar${errors.startTime ? "-error-border" : ""}`}
                {...register("startTime", { required: true })}
              />
            </div>
          <div className="todo-cell" data-label="End Time">
            <input
              type="time"
              className={`time-bar${errors.endTime ? "-error-border" : ""}`}
              {...register("endTime", { required: true })}
            />
          </div>
          </>
        )}
        {checkAccessIsTaskList(access) && (
          <div className="todo-cell" data-label="Target Date">
            <input
              type="date"
              className={`time-bar${errors.targetDate ? "-error-border" : ""}`}
              {...register("targetDate", { required: true })}
              min={new Date().toISOString().split("T")[0]} // Restrict to past dates including today
            />
          </div>
        )}
        <div className="todo-cell" data-label="Actions">
          <button
            type="submit"
            className="submit-form-button"
            title="Add New Task"
            disabled={isSubmitting}
          >
            <span>
              <PlusIcon />
            </span>
            <div>{isSubmitting ? "Adding..." : ""}</div>
          </button>
        </div>
      </form>
    </>
  );
};

const { PlusIcon } = newFunction();

function newFunction() {
  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
    </svg>
  );

  return { PlusIcon };
}

export default React.memo(AddTask);