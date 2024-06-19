import { User } from "./user";

export class Admin extends User {
  constructor(
    employee_id: number,
    firstname: string,
    lastname: string,
    role_id: number
  ) {
    super(employee_id, firstname, lastname, role_id);
  }

  // Additional Admin-specific methods

  viewMenu = () => {
    console.log("Admin is viewing the menu");
    // Implement the actual functionality here
  };

  addMenuItem = () => {
    console.log("Admin is adding a new menu item");
    // Implement the actual functionality here
  };

  deleteMenuItem = () => {
    console.log("Admin is deleting a menu item");
    // Implement the actual functionality here
  };

  updateMenuItem = () => {
    console.log("Admin is updating a menu item");
    // Implement the actual functionality here
  };
}
