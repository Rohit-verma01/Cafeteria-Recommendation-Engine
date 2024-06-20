import { MenuItemService } from "../services/menuItemService";

export class AdminController {
    private menuItemService: MenuItemService;

    constructor() {
        this.menuItemService = new MenuItemService();
    }

    viewMenu = () => {
        console.log("Admin is viewing the menu");
        // Implement the actual functionality here
    };

    addMenuItem = async(payload:any) => {
        return await this.menuItemService.addItem(payload)
    };

    deleteMenuItem = () => {
        console.log("Admin is deleting a menu item");
        // Implement the actual functionality here
    };

    updateMenuItem = () => {
        console.log("Admin is updating a menu item");
        // Implement the actual functionality here
    };

    async executeFunctionality(index: number, payload: any) {
        switch (index) {
          case 1:
                return this.addMenuItem(payload)
            // await this.adminService.viewMenu();
            break;
          case 2:
            // await this.adminService.addItem(payload);
            break;
          case 3:
            // await this.adminService.updateItem(payload);
            break;
          case 4:
            // await this.adminService.deleteItem(payload);
            break;
          default:
            console.error("Invalid function index for admin");
        }
      }
}
