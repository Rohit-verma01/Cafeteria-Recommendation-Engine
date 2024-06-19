import { User } from "../models/user";

export class ChefController {
    private chef: User;

    constructor(chef: User) {
        this.chef = chef;
    }

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
}
