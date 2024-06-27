import { Socket } from "socket.io-client";
import {
  promptForDeleteItem,
  promptForFeedback,
  promptForFoodItemDetails,
  promptForRollOut,
  promptForUpdateFoodItem,
  promptForVote,
  promptInput,
} from "./prompts";

export const showAvailableFunctions = (functions: string[]) => {
  functions.forEach((func: string, index: number) => {
    console.log(`${index + 1}. ${func}`);
  });
};

export const voteForItems = async (socket: Socket, employeeId: number) => {
  let menu = {},message = "";
  await new Promise<void>((resolve) => {
    socket.emit("isUserVoted", employeeId);
    socket.on("checkUserVoted", async (response) => {
      message = response;
      resolve();
    });
  });
  message&&console.log(message);
  if (message == "") {
    await new Promise<void>((resolve) => {
      socket.emit("showRollOutMenu");
      socket.on("sendRecommendedMenu", async (response) => {
        menu = response.data;
        console.table(response.data);
        resolve();
      });
    });
    return await promptForVote(menu);
  }
};

export const giveFeedback = async (socket: Socket) => {
  await new Promise<void>((resolve) => {
    socket.emit("showMenu");
    socket.on("sendMenu", async (response) => {
      console.log("here", response);
      console.table(response.data, ["itemId", "item", "price", "category"]);
      resolve();
    });
  });
  return await promptForFeedback();
};

export const rollOutItems = async (socket: Socket, functions: any) => {
  await new Promise<void>((resolve) => {
    socket.emit("showMenu");
    socket.on("sendMenu", async (response) => {
      console.log("here", response);
      console.table(response.data, ["itemId", "item", "price", "category"]);
      resolve();
    });
  });
  return await promptForRollOut(functions);
};

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
      return await handleChefInput(selectedIndex, socket, functions);
    case "employee":
      return await handleEmployeeInput(selectedIndex, socket, employeeId);
  }
};

export const handleAdminInput = async (selectedIndex: number) => {
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
  socket: Socket,
  functions: any
) => {
  switch (selectedIndex) {
    case 1:
      return await rollOutItems(socket, functions);
    case 2:
      return "";
    case 3:
      return "";
    case 4:
      return "";
  }
};

export const handleEmployeeInput = async (
  selectedIndex: number,
  socket: Socket,
  employeeId: number
) => {
  switch (selectedIndex) {
    case 1:
      return "";
    case 2:
      // return await promptForUpdateFoodItem();
      break;
    case 3:
      return await giveFeedback(socket);
    case 4:
      return await voteForItems(socket, employeeId);
  }
};

export const validateUniqueItems = (items: {
  [key: string]: number[];
}): boolean => {
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
  console.log("item = ", allItems);
  return true;
};

export const validateVotedId = (
  itemWithMealType: any,
  votedFoodItemId: any
): boolean => {

  const isItemsPresent = votedFoodItemId.every((itemId: number) =>
    itemWithMealType.some((item: any) => item.item_id === itemId)
  );
  if (!isItemsPresent) {
    console.log("Please vote from the given menu only\n");
    return false;
  }

  const isItemsUnique =
    votedFoodItemId.length === new Set(votedFoodItemId).size;
  if (!isItemsUnique) {
    console.log("Please vote for different items only\n");
    return false;
  }

  const isItemBelongToDifferentMeal = checkItemsBelongToDifferentMeal(
    itemWithMealType,
    votedFoodItemId
  );
  if (!isItemBelongToDifferentMeal) {
    console.log("Please vote only for one Item from one meal type\n");
    return false;
  }

  return true;
};

export const checkItemsBelongToDifferentMeal = (
  itemWithMealType: any,
  votedFoodItemId: any
) => {
  const mealTypeIds = new Set();

  for (const itemId of votedFoodItemId) {
    const item = itemWithMealType.find((item: any) => item.item_id === itemId);
    const mealTypeId = item.meal_type_id;
    if (mealTypeIds.has(mealTypeId)) {
      return false; // Found a duplicate meal_type_id
    }
    mealTypeIds.add(mealTypeId);
  }

  return true;
};
