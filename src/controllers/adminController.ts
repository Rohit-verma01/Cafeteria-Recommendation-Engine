import { User } from "../models/user";

export class AdminController {
    private admin: User;

    constructor(admin: User) {
        this.admin = admin;
    }

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
