import { promptForDeleteItem, promptForFoodItemDetails, promptForUpdateFoodItem } from "../utils/prompts";

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
      case 5:
        return "";
      case 6:
        return "";
    }
  };