import { MenuItemService } from "../services/menuItemService";

export class ChefController {
  private menuItemService: MenuItemService;

  constructor() {
    this.menuItemService = new MenuItemService();
  }

    rollOutItems = async(payload:any) => {
        console.log("Chef is rolling out the item");
        const data = await this.menuItemService.addItemInRecommendedMenu(payload);
        return {data,type:"message"}
    };

    viewMenu = async () => {
      console.log("Chef is viewing the menu");
      const data = await this.menuItemService.viewMenu();
      return {data,type:"foodItem"}
    };

    viewFeedback = () => {
        console.log("Chef is viewing feedback");
    };

    async executeFunctionality(index: number, payload: any) {
        switch (index) {
          case 1:
            return this.rollOutItems(payload);
          case 2:
            // return this.updateMenuItem(payload);
          case 3:
            return this.viewMenu();
          case 4:
            return this.viewMenu();
          default:
            console.error("Invalid function index for admin");
        }
    }
}
