import { MenuItemService } from "../services/menuItemService";

export class AdminController {
  private menuItemService: MenuItemService;

  constructor() {
    this.menuItemService = new MenuItemService();
  }

  viewMenu = async () => {
    console.log("Admin is viewing the menu");
    return await this.menuItemService.viewMenu();
    // Implement the actual functionality here
  };

  addMenuItem = async (payload: any) => {
    return await this.menuItemService.addItem(payload);
  };

  deleteMenuItem = async(payload:any) => {
    console.log("Admin is deleting a menu item");
    return await this.menuItemService.deleteItem(payload);
    // Implement the actual functionality here
  };

  updateMenuItem = async (payload: any) => {
    console.log("Admin is updating a menu item");
    return await this.menuItemService.updateItem(payload);
  };

  async executeFunctionality(index: number, payload: any) {
    switch (index) {
      case 1:
        return this.addMenuItem(payload);
      // await this.adminService.viewMenu();
      case 2:
        return this.updateMenuItem(payload);
      case 3:
        // await this.adminService.updateItem(payload);
        // return this.viewMenu();
        return this.deleteMenuItem(payload)
        break;
      case 4:
        return this.viewMenu();
        break;
      default:
        console.error("Invalid function index for admin");
    }
  }
}
