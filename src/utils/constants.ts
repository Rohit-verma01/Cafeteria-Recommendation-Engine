export const UserActivity = {
  VIEW_MENU: "View Menu",
  VIEW_NOTIFICATION: "View Notification",
  GIVE_FEEDBACK: "Give Feedback",
  VOTE_FOR_RECOMMENDED_MENU: "Give Vote for Recommended Menu",
  GIVE_DETAILED_FEEDBACK_FOR_DISCARD_ITEM:
    "Give Detailed Feedback for Discard Item",
  UPDATE_PROFILE: "Update profile",
  LOGOUT: "Logout",
  ROLL_OUT_ITEMS: "Roll Out Items",
  SEND_FINAL_MENU: "Send Final Menu",
  VIEW_DISCARD_MENU: "View Discard Menu",
  ADD_ITEM: "Add Item",
  UPDATE_ITEM: "Update Item",
  DELETE_ITEM: "Delete Item",
  VIEW_RECOMMEDATION: "View Recommendation",
  REMOVE_THORUGH_DISCARD:"Remove item thorugh discard list",
  ADD_ITEM_FOR_DETAILED_FEEDBACK:"Add item for detailed feedback",
};

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
  10:"Sweets"
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

export const employeeOptionMapping=[
  'View Menu', 'View Notification', 'Give Feedback','Vote for Recommended Menu','Give Detailed Feedback for Discard Item','Update profile','Logout',
]

export const chefOptionMapping=[
  'Roll Out Items', 'Send Final Menu','View Menu','View Notifcation','View Discard Menu','Logout',
]

export const adminOptionMapping=[
  'Add Item','Update Item','Delete Item','View Menu','Logout'
]

type NumberKeyedStringObject = {
  [key: number]: string;
};

export const logObject = (object:NumberKeyedStringObject) => {
  return Object.entries(object)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};