import React, { useEffect } from "react";
import TodoRow from "./TodoRow";
import { useForm } from "react-hook-form";
import { executeGetAllMyRoutinesService } from "../../api/TodoApiService";
import { useUserDashboard } from "../../context/UserDashboardContext";
import { useAccess } from "../../context/AccessContext";
import { checkAccessIsMyRoutin } from "../../utils/format";

function MyRoutin() {
  console.log("Rendering MyRoutin");

  const { access } = useAccess();
  const { myRoutinFormate, setMyRoutinFormate } = useUserDashboard();

  useEffect(()=>{
    async function fetchMyRoutines() {
      try {
        const response = await executeGetAllMyRoutinesService();
        if (response.status === 200) {
          setMyRoutinFormate(response.data.map((item) => ({
            id: item.routineId,
            title: item.title,
            description: item.description,
            startTime : item.startTime,
            endTime : item.endTime,
            status: item.status,
          })));
          console.log("My Routines Data ", response.data);
        }
      } catch (error) {
        console.error("Error fetching my routines:", error);
      }
    }

    if (checkAccessIsMyRoutin(access)) {
      fetchMyRoutines();
    }
  }, [setMyRoutinFormate, access]);

  return (
    <>
      <div className="content-header">
        <div className="header-center">
          <h1>My Routin</h1>
        </div>
        {/* <div className="content-description">
          <p>Namste Parth</p>
        </div> */}
      </div>

      <div className="dashboard-content"> 
        <div className="todo-container">
          <div className="todo-header">
            <div className="todo-cell">Is Done?</div>
            <div className="todo-cell">Title</div>
            <div className="todo-cell">Description</div>
            <div className="todo-cell">Start Time</div>
            <div className="todo-cell">End Time</div>
            <div className="todo-cell">Actions</div>
          </div>

          <TodoRow />
        </div>
      </div>
    </>
  );
}

// function AddTask() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm();

//   const onSubmit = async (data) => {
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//     console.log("submitted data form", data);
//     reset(); // Reset the form fields after successful submission
//   };

//   return (
//     <>
//       <form className="todo-row add-new" onSubmit={handleSubmit(onSubmit)}>
//         <div className="todo-cell is-done" data-label="Is Done">
//           <span>---</span>
//         </div>
//         <div className="todo-cell" data-label="Title">
//           <input
//             type="text"
//             placeholder="Add New Title*"
//             className={`text-input${errors.title ? "-error-border" : ""}`}
//             {...register("title", {
//               required: { value: true, message: "titel required!" },
//             })}
//           />
//           {/* {errors.title && <span className="error-msg">{errors.title.message}</span>} */}
//         </div>
//         <div className="todo-cell" data-label="Description">
//           <textarea
//             placeholder="Add New Description"
//             className={`text-input${
//               errors.description ? "-error-border" : ""
//             } text-area`}
//             {...register("description", {
//               required: { value: true, message: "description required!" },
//             })}
//           />
//           {/* {errors.description && <span className="error-msg">{errors.description.message}</span>} */}
//         </div>
//         <div className="todo-cell" data-label="Start Time">
//           <input
//             type="time"
//             className={`time-bar${errors.startTime ? "-error-border" : ""}`}
//             {...register("startTime", { required: true })}
//           />
//         </div>
//         <div className="todo-cell" data-label="End Time">
//           <input
//             type="time"
//             className={`time-bar${errors.endTime ? "-error-border" : ""}`}
//             {...register("endTime", { required: true })}
//           />
//         </div>
//         <div className="todo-cell" data-label="Actions">
//           <button
//             type="submit"
//             className="submit-form-button"
//             title="Add New Task"
//             disabled={isSubmitting}
//           >
//             <span>
//               <PlusIcon />
//             </span>
//             <div>{isSubmitting ? "Adding..." : ""}</div>
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

// icons
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

export default React.memo(MyRoutin);
