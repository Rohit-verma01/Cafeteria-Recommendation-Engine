import { User } from "../models/user";
import { MenuItemService } from "../services/menuItemService";

export class ChefController {
  private menuItemService: MenuItemService;

  constructor() {
    this.menuItemService = new MenuItemService();
  }

    rollOutItems = async(payload:any) => {
        console.log("Chef is rolling out the item");
        this.menuItemService
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

    async executeFunctionality(index: number, payload: any) {
        switch (index) {
          case 1:
            return this.rollOutItems(payload);
          case 2:
            // return this.updateMenuItem(payload);
          case 3:
            // return this.deleteMenuItem(payload)
          case 4:
            return this.viewMenu();
          default:
            console.error("Invalid function index for admin");
        }
    }
}
