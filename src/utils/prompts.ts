import { createReadlineInterface } from "./readline";
import {
  categories,
  cuisinePreference,
  dietPreference,
  logObject,
  spiceLevel,
} from "./category";
import {
  validateOptionsForUpdateProfile,
  validateUniqueItems,
  validateVotedId,
} from "../client/validation";

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
): Promise<any> => {
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

export const promptForDiscardMenu = async (list: any): Promise<any> => {
  console.log("1) Remove Food Item");
  console.log("2) Get Detailed Feedback");
  const index = parseInt(await promptInput("Select a function number: "));
  if (index === 1) {
    const name = await promptInput(
      "Enter item name to remove from above list: "
    );

    const selectedFoodItem = list.find((item: any) => item.item === name);
    if (selectedFoodItem) {
      return { index: 7, data: selectedFoodItem.item };
    } else {
      console.log("Please enter a valid item name from the table only.");
      return promptForDiscardMenu(list);
    }
  } else if (index === 2) {
    const itemId = parseInt(
      await promptInput(
        "Enter item Id to get detailed feedback from above list: "
      )
    );
    const selectedFoodItem = list.find((item: any) => item.itemId === itemId);
    if (selectedFoodItem) {
      return { index: 8, data: selectedFoodItem.itemId };
    } else {
      console.log("Please enter a valid item ID from the table only.");
      return promptForDiscardMenu(list);
    }
  } else {
    console.log("Invalid selection. Please select a valid function number.");
    return promptForDiscardMenu(list);
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

export const promptForRollOut = async () => {
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
  else promptForRollOut();
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
  return { itemId, rating, comment };
};

export const promptForDeatiledFeedback = async (item: {
  itemId: number;
  name: string;
}): Promise<any> => {
  const { itemId, name } = item;
  const likeResponse = await promptInput(
    `Q1. How would you like ${name} to taste?\nAns. `
  );
  const dislikeResponse = await promptInput(
    `Q2. What didn’t you like about ${name}?\nAns. `
  );
  const reciepeResponse = await promptInput(
    `Q3. Share your mom’s recipe for ${name}.\nAns. `
  );
  if (
    likeResponse.trim().length &&
    dislikeResponse.trim().length &&
    reciepeResponse.trim().length
  )
    return { itemId, likeResponse, dislikeResponse, reciepeResponse };
  else return promptForDeatiledFeedback(item);
};

export const promptForUpdateProfile = async () => {
  let dietType = 0,
    spicyLevel = 0,
    prefer = 0,
    likeSweet = false;

  while (true) {
    console.log(`Q). Please select one-\n${logObject(dietPreference)}`);
    dietType = parseInt(await promptInput(`Your choice: `));
    if (validateOptionsForUpdateProfile(dietPreference, dietType)) break;
    console.log("Invalid Selection\n");
  }

  while (true) {
    console.log(
      `Q). Please select your spice level-\n${logObject(spiceLevel)}`
    );
    spicyLevel = parseInt(await promptInput(`Your choice: `));
    if (validateOptionsForUpdateProfile(spiceLevel, spicyLevel)) break;
    console.log("Invalid Selection\n");
  }

  while (true) {
    console.log(
      `Q). What do you prefer most?\n${logObject(cuisinePreference)}`
    );
    prefer = parseInt(await promptInput(`Your choice: `));
    if (validateOptionsForUpdateProfile(cuisinePreference, prefer)) break;
    console.log("Invalid Selection\n");
  }

  while (true) {
    const answer = await promptInput(
      `Q). Do you have a sweet tooth (yes/no)?\nAns. `
    );
    if (answer.toLowerCase() === "yes") {
      likeSweet = true;
      break;
    } else if (answer.toLowerCase() === "no") {
      likeSweet = false;
      break;
    }
    console.log("Invalid Selection\n");
  }

  return {dietType, spicyLevel, prefer, likeSweet};
};
