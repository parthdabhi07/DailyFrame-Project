export const checkAccessIsMyRoutin = (accessArray) => {
    return accessArray[0] === "My Routin";
}

export const checkAccessIsTaskList = (accessArray) => {
    return typeof accessArray[0] === "number";
}