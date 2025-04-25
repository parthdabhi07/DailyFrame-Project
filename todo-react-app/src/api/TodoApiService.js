import { apiClient } from "./apiClient";

export const executeGetUserDashboardService = async () => { 
  return await apiClient.get(`api/users`); 
};

export const executeCreateUserService = async (email, password, username) => {
  return await apiClient.post(`api/users`, {
    email: email,
    password: password,
    username: username
  });
}

export const executeGetAllListService = async () => {
  return await apiClient.get(`api/users/lists`);
}

export const executeAddNewListService = async (email, listName) => {
  return await apiClient.post(`api/lists`, {
    listName: listName,
    userEmail: email,
  });
}

export const executeGetAllMyRoutinesService = async () => {
  return await apiClient.get(`api/users/routines`);
}

export const executeNewMyRoutineService = async (data) => {
  return await apiClient.post(`api/users/routines`, {
    title: data.title,
    description: data.description,
    startTime: data.startTime,
    endTime: data.endTime,
  });
}

export const executeUpdateMyRoutineService = async (data, id) => {
  try {
    return await apiClient.put(`api/routines/${id}`, {
      title: data[`title-${id}`],
      description: data[`description-${id}`],
      startTime: data[`startTime-${id}`],
      endTime: data[`endTime-${id}`],
      status: data[`isDone-${id}`],
    });
  } catch (error) {
    console.error("Error updating routine:", error);
    throw error;
  }
}

export const executeDeleteMyRoutineService = async (id) => {
  return await apiClient.delete(`api/routines/${id}`);
}

export const executeGetAllTodoInListService = async (listId) => {
  return await apiClient.get(`api/lists/${listId}/todos`);
}

export const executeAddNewTodoService = async (data, listId) => {
  console.log("Payload sent to API:", {
    description: data.description,
    status: data.status,
    targetDate: data.targetDate,
    listId: listId,
  }); // Debugging line

  return await apiClient.post(`api/todos`, {
    description: data.description,
    status: data.status,
    targetDate: data.targetDate,
    listId: listId,
  });
};

export const executeUpdateTodoService = async (data, id) => {
  return await apiClient.put(`api/todos/${id}`, {
    description: data[`description-${id}`],
    status: data[`isDone-${id}`],
    targetDate: data[`targetDate-${id}`],
  });
}

export const executeDeleteTodoService = async (id) => {
  return await apiClient.delete(`api/todos/${id}`);
}