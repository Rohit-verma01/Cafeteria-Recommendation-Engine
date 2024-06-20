import { Socket } from "socket.io-client";
import { createReadlineInterface } from "./readline";
import { handleUserSelection } from "./clientUtils";
import { categories, logObject } from "./category";

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
) => {
  const selection = await promptInput("Select a function number: ");
  const selectedIndex = parseInt(selection);

  if (selectedIndex!=undefined && selectedIndex >= 1 && selectedIndex <= functions.length) {
    return selectedIndex;
  } else {
    console.error("Invalid function number");
    promptFunctionSelection(functions,roleName);
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

export const promptForUpdateFoodItem = async() => {
  const foodName = await promptInput("Enter food name: ");
  const wantToUpdateItemPrice = await promptInput("Is you want to update price(y/n): ");
  let foodPrice="",availabilityStatus="";
  if(wantToUpdateItemPrice==='y')
    foodPrice = await promptInput("Enter food price: ");
  const wantToUpdateItemStatus = await promptInput("Is you want to update status(y/n): ");
  if(wantToUpdateItemStatus==='y')
    availabilityStatus = await promptInput("Change availability status to true or false: ");
  console.log(foodName,parseInt(foodPrice),availabilityStatus)
  return {foodName,foodPrice:parseInt(foodPrice),availabilityStatus}
}

export const promptForDeleteItem = async() => {
  const foodName = await promptInput("Enter food name to delete: ");
  return foodName
}