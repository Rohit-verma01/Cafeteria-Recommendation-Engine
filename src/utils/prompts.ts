import { Socket } from "socket.io-client";
import { createReadlineInterface } from "./readline";
import { categories, logObject } from "./category";
import {
  showAvailableFunctions,
  validateUniqueItems,
  validateVotedId,
} from "./clientUtils";

const rl = createReadlineInterface();

export const promptInput = (query: string): Promise<string> =>
  new Promise((resolve) =>
    rl.question(query, (input) => {
      resolve(input.trim());
    })
  );

export const promptFunctionSelection = async (
  functions: string[],
  roleName: string
):Promise<any> => {
  const selection = await promptInput("Select a function number: ");
  const selectedIndex = parseInt(selection);

  if (
    selectedIndex != undefined &&
    selectedIndex >= 1 &&
    selectedIndex <= functions.length
  ) {
    return selectedIndex;
  } else {
    console.error("Invalid function number");
    return promptFunctionSelection(functions, roleName);
  }
};

export const promptForFoodItemDetails = async () => {
  const foodName = await promptInput("Enter food item name: ");
  const price = await promptInput("Enter food item price: ");
  console.log("Below are the categories :");
  logObject(categories);
  const categoryId = await promptInput("Select Category: ");
  const foodItemDetails = {
    foodName,
    price: parseFloat(price),
    categoryId: parseInt(categoryId),
  };
  return foodItemDetails;
};

export const promptForUpdateFoodItem = async () => {
  const foodName = await promptInput("Enter food name: ");
  const wantToUpdateItemPrice = await promptInput(
    "Are you want to update price(y/n): "
  );
  let foodPrice = "",
    availabilityStatus = "";
  if (wantToUpdateItemPrice === "y")
    foodPrice = await promptInput("Enter food price: ");
  const wantToUpdateItemStatus = await promptInput(
    "Are you want to update status(y/n): "
  );
  if (wantToUpdateItemStatus === "y")
    availabilityStatus = await promptInput(
      "Change availability status to true or false: "
    );
  return { foodName, foodPrice: parseInt(foodPrice), availabilityStatus };
};

export const promptForDeleteItem = async () => {
  const foodName = await promptInput("Enter food name to delete: ");
  return foodName;
};

export const promptForRollOut = async (functions: any) => {
  let noOfItem = parseInt(
    await promptInput("Enter number of breakfast you want for recommendation: ")
  );
  const breakfast = [],
    lunch = [],
    dinner = [];
  for (let i = 0; i < noOfItem; i++) {
    const id = parseInt(
      await promptInput(`Enter ${i + 1} food item id for breakfast: `)
    );
    breakfast.push(id);
  }
  noOfItem = parseInt(
    await promptInput(
      "Enter number of lunch item you want for recommendation: "
    )
  );
  for (let i = 0; i < noOfItem; i++) {
    const id = parseInt(
      await promptInput(`Enter ${i + 1} food item id for lunch: `)
    );
    lunch.push(id);
  }
  noOfItem = parseInt(
    await promptInput(
      "Enter number of dinner item you want for recommendation: "
    )
  );
  for (let i = 0; i < noOfItem; i++) {
    const id = parseInt(
      await promptInput(`Enter ${i + 1} food item id for dinner: `)
    );
    dinner.push(id);
  }
  if (validateUniqueItems({ breakfast, lunch, dinner }))
    return { breakfast, lunch, dinner };
  else promptForRollOut(functions);
};

export const promptForVote = async (menu: any) => {
  while (true) {
    const Id = await promptInput(
      "Enter comma seperated item id's for which you wanted to vote: "
    );
    const votedFoodItemId = Id.split(",").map((item) => parseInt(item));
    const itemWithMealType = menu.map((item: any) => {
      return {
        item_id: item.item_id,
        meal_type_id: item.meal_type_id,
      };
    });
    if (validateVotedId(itemWithMealType, votedFoodItemId))
      return votedFoodItemId;
  }
};

export const promptForFeedback = async () => {
  const itemId = parseInt(
    await promptInput("Enter Item ID to give feedback for: ")
  );
  const rating = parseFloat(
    await promptInput(`Enter rating for item ID ${itemId}: `)
  );
  const comment = await promptInput(`Enter comment for item ID ${itemId}: `);
  console.log("item rating = ",rating)
  return { itemId, rating, comment };
};
