import { Socket } from "socket.io-client";
import { promptForDeleteItem, promptForFoodItemDetails, promptForRollOut, promptForUpdateFoodItem, promptInput } from "./prompts";

export const showAvailableFunctions = (functions: string[]) => {
  functions.forEach((func: string, index: number) => {
    console.log(`${index + 1}. ${func}`);
  });
};

export const rollOutItems = async (socket:Socket) => {
  await new Promise<void>((resolve) => {
    socket.emit("showMenu");
    socket.on("sendMenu", async (response) => {
      console.log("here", response);
      console.table(response.data,['itemId','item', 'price', 'category']);
      resolve();
    });
  });
  return await promptForRollOut();
}

export const handleUserSelection = async(
  roleName: string,
  selectedIndex: number,
  socket:Socket,
) => {
  switch (roleName) {
    case "admin":
      return await handleAdminInput(selectedIndex);
    case "chef":
      return await handleChefInput(selectedIndex,socket);
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
    case 4:
      return "";
  }
};

export const handleChefInput = async (
  selectedIndex: number,
  socket:Socket
) => {
  switch (selectedIndex) {
    case 1:
      return await rollOutItems(socket);
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


