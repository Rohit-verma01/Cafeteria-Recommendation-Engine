import { Socket } from "socket.io-client";
import { promptForDeleteItem, promptForFoodItemDetails, promptForUpdateFoodItem, promptInput } from "./prompts";

export const showAvailableFunctions = (functions: string[]) => {
  functions.forEach((func: string, index: number) => {
    console.log(`${index + 1}. ${func}`);
  });
};

export const handleUserSelection = async(
  roleName: string,
  selectedIndex: number
) => {
  switch (roleName) {
    case "admin":
      return await handleAdminInput(selectedIndex);
    case "chef":
      console.log("chef");
      break;
    case "employee":
      console.log("employee");
      break;
  }
};

export const handleAdminInput = async (
  selectedIndex: number
) => {
  switch (selectedIndex) {
    case 1:
      return await promptForFoodItemDetails();
    case 2:
      return await promptForUpdateFoodItem();
    case 3:
      return await promptForDeleteItem();
      break;
    case 4:
      return "";
      break;
  }
};


