import { User } from "../models/user";

export class EmployeeController {
    private employee: User;

    constructor(employee: User) {
        this.employee = employee;
    }

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
}
