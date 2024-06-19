import { User } from "./user";

export class Employee extends User {
  constructor(
    employee_id: number,
    firstname: string,
    lastname: string,
    role_id: number
  ) {
    super(employee_id, firstname, lastname, role_id);
  }

  // Additional Employee-specific methods
  viewMenu = () => {
    console.log("Employee is viewing the menu");
    // Implement the actual functionality here
  };

  viewFeedback = () => {
    console.log("Employee is viewing feedback");
    // Implement the actual functionality here
  };

  giveFeedback = () => {
    console.log("Employee is giving feedback");
    // Implement the actual functionality here
  };

  employeeSpecificMethod = () => {
    console.log("Employee-specific method");
    // Implementation of Employee-specific method
  };
}
