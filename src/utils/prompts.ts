import { Socket } from "socket.io-client";
import { createReadlineInterface } from "./readline";
import { handleUserSelection } from "./clientUtils";

const rl = createReadlineInterface();

export const promptInput = (query: string): Promise<string> =>
  new Promise((resolve) =>
    rl.question(query, (input) => {
      resolve(input.trim());
    })
  );

export const promptFunctionSelection = (
  socket: Socket,
  functions: string[],
  roleName: string
): Promise<number | void> => {
  return promptInput("Select a function number: ").then((selection) => {
    const selectedFunctionIndex = parseInt(selection);
    if (
      selectedFunctionIndex >= 1 &&
      selectedFunctionIndex <= functions.length
    ) {
      return selectedFunctionIndex;
      // return await handleUserSelection(socket,roleName,selectedFunctionIndex)
    } else {
      console.error("Invalid selection");
      promptFunctionSelection(socket, functions, roleName);
    }
  });
};

export const executeFunction = (socket: Socket, functionName: string) => {
  console.log(`Executing function: ${functionName}`);
  socket.emit(functionName); // Emit the function name to the server to execute the functionality
};

export const promptForFoodItemDetails = async (
  socket: Socket
): Promise<any> => {
  console.log("Add new food item");
  const foodName = await promptInput("Enter food item name: ");
  const price = await promptInput("Enter food item price: ");
  const foodItemDetails = { foodName, price: parseFloat(price) };
  console.log(foodItemDetails);
  return foodItemDetails;
  // socket.emit("addItem",foodItemDetails)
};
