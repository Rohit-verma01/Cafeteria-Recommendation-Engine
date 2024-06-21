import { MenuItemService } from "../services/menuItemService";

export class AdminController {
  private menuItemService: MenuItemService;

  constructor() {
    this.menuItemService = new MenuItemService();
  }

  viewMenu = async () => {
    console.log("Admin is viewing the menu");
    const data = await this.menuItemService.viewMenu();
    return {data,type:"foodItem"}
    // return await this.menuItemService.viewMenu();
  };

  addMenuItem = async (payload: any) => {
    const data = await this.menuItemService.addItem(payload);
    return {data,type:"message"}
    // return await this.menuItemService.addItem(payload);
  };

  deleteMenuItem = async(payload:any) => {
    console.log("Admin is deleting a menu item");
    const data = await this.menuItemService.deleteItem(payload);
    return {data,type:"message"}
    // return await this.menuItemService.deleteItem(payload);
  };

  updateMenuItem = async (payload: any) => {
    console.log("Admin is updating a menu item");
    const data = await this.menuItemService.updateItem(payload);
    return {data,type:"foodItem"}
    // return await this.menuItemService.updateItem(payload);
  };

  async executeFunctionality(index: number, payload: any) {
    switch (index) {
      case 1:
        return this.addMenuItem(payload);
      case 2:
        return this.updateMenuItem(payload);
      case 3:
        return this.deleteMenuItem(payload)
      case 4:
        return this.viewMenu();
      default:
        console.error("Invalid function index for admin");
    }
  }
}
