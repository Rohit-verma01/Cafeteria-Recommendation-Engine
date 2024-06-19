import { Socket } from "socket.io-client";
import { promptForFoodItemDetails, promptInput } from "./prompts";

export const showAvailableFunctions = (functions: string[]) => {
  console.log("Available functionalities:", functions);
  functions.forEach((func: string, index: number) => {
    console.log(`${index + 1}. ${func}`);
  });
};

export const handleUserSelection = async(
  socket: Socket,
  roleName: string,
  selectedIndex: number
) => {
  switch (roleName) {
    case "admin":
      // handleAdminInput(socket,selectedIndex);
      // console.log("In User Handle",handleAdminInput(socket,selectedIndex))
      return await handleAdminInput(socket,selectedIndex);
      break;
    case "chef":
      console.log("chef");
      break;
    case "employee":
      console.log("employee");
      break;
  }
};

export const handleAdminInput = async (
  socket: Socket,
  selectedIndex: number
) => {
  switch (selectedIndex) {
    case 1:
      console.log("Add Item");
      // promptForFoodItemDetails(socket)
      // console.log("Handle Admin Input",promptForFoodItemDetails(socket))
      return await promptForFoodItemDetails(socket)
      break;
    case 2:
      console.log("2nd");
      break;
    case 3:
      console.log("3rd");
      break;
    case 4:
      console.log("4th");
      break;
  }
};


