import { Socket } from "socket.io-client";
import { promptForDeleteItem, promptForFoodItemDetails, promptForRollOut, promptForUpdateFoodItem, promptInput } from "./prompts";

export const showAvailableFunctions = (functions: string[]) => {
  functions.forEach((func: string, index: number) => {
    console.log(`${index + 1}. ${func}`);
  });
};

export const rollOutItems = async (socket:Socket,functions:any) => {
  await new Promise<void>((resolve) => {
    socket.emit("showMenu");
    socket.on("sendMenu", async (response) => {
      console.log("here", response);
      console.table(response.data,['itemId','item', 'price', 'category']);
      resolve();
    });
  });
  return await promptForRollOut(functions);
}

export const handleUserSelection = async(
  roleName: string,
  selectedIndex: number,
  socket:Socket,
  functions:any,
) => {
  switch (roleName) {
    case "admin":
      return await handleAdminInput(selectedIndex);
    case "chef":
      return await handleChefInput(selectedIndex,socket,functions);
    case "employee":
      
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
  socket:Socket,
  functions:any
) => {
  switch (selectedIndex) {
    case 1:
      return await rollOutItems(socket,functions);
    case 2:
      return await promptForUpdateFoodItem();
    case 3:
      return ""
      break;
    case 4:
      return "";
      break;
  }
};


export const validateUniqueItems = (items: { [key: string]: number[] }): boolean =>{
  const allItems = new Set<number>();
  for (const mealType in items) {
    const itemIds = items[mealType];
    for (const itemId of itemIds) {
      if (allItems.has(itemId)) {
        console.error(`Item ID ${itemId} is duplicated across meal types.`);
        return false;
      }
      allItems.add(itemId);
    }
  }
  console.log("item = ",allItems)
  return true;
}