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
      return false;
    }
    mealTypeIds.add(mealTypeId);
  }

  return true;
};

export const validateOptionsForUpdateProfile = (options:any,selected:number) => {
  const optionKeys = Object.keys(options).map(Number);
  if(optionKeys.includes(selected))
    return true;
  return false
}
