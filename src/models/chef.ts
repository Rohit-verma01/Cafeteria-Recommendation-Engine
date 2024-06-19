import { User } from "./user";

export class Chef extends User {
  constructor(
    employee_id: number,
    firstname: string,
    lastname: string,
    role_id: number
  ) {
    super(employee_id, firstname, lastname, role_id);
  }

  // Additional Chef-specific methods
  decideMenu = () => {
    console.log("Chef is deciding the menu");
    // Implement the actual functionality here
  };

  viewMenu = () => {
    console.log("Chef is viewing the menu");
    // Implement the actual functionality here
  };

  viewFeedback = () => {
    console.log("Chef is viewing feedback");
    // Implement the actual functionality here
  };

  chefSpecificMethod = () => {
    console.log("Chef-specific method");
    // Implementation of Chef-specific method
  };
}
