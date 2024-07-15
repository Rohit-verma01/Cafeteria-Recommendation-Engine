import { Socket } from "socket.io-client";
import { handleAdminInput } from "./adminHandler";
import { handleEmployeeInput } from "./employeeHandler";
import { handleChefInput } from "./chefHandler";

export const handleUserSelection = async (
  roleName: string,
  selectedIndex: number,
  socket: Socket,
  functions: any,
  employeeId: number
) => {
  switch (roleName) {
    case "admin":
      return await handleAdminInput(selectedIndex);
    case "chef":
      return await handleChefInput(selectedIndex, socket,employeeId);
    case "employee":
      return await handleEmployeeInput(selectedIndex, socket, employeeId);
  }
};

export const showAvailableFunctions = (functions: string[]) => {
  functions.forEach((func: string, index: number) => {
    console.log(`${index + 1}. ${func}`);
  });
};

