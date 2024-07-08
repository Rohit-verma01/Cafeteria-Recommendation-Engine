export const categories = {
    1:"Pizza",
    2:"Burger",
    3:"Shakes",
    4:"Snacks",
    5:"Breakfast",
    6:"Wraps",
    7:"Sandwich",
    8:"Pulses",
    9:"Vegetables",
}

export const dietPreference = {
    1:"Vegetarian",
    2:"Non Vegeterian",
    3:"Eggeterian"
}

export const spiceLevel = {
    1:"High",
    2:"Medium",
    3:"Low"
}

export const cuisinePreference = {
    1:"North Indian",
    2:"South Indian",
    3:"Other"
}


type NumberKeyedStringObject = {
    [key: number]: string;
};

export const logObject = (object:NumberKeyedStringObject) => {
    return Object.entries(object)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };