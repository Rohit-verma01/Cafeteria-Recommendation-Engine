import { MenuItemService } from "../services/menuItemService";
import { NotificationService } from "../services/notificationService";

export class ChefController {
  private menuItemService: MenuItemService;
  private notificationService: NotificationService;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.notificationService = new NotificationService();
  }

  rollOutItems = async (payload: any) => {
    const data = await this.menuItemService.addItemInRecommendedMenu(payload);
    if (data.success) {
      await this.notificationService.sendRollOutNotification(payload, 3);
      return {data:data.message,type:"message"};
    }
    return {data:data.message,type:"message"}
  };

  viewMenu = async () => {
    const data = await this.menuItemService.viewMenu();
    return { data, type: "foodItem" };
  };

  viewNotification = async(user:any) => {
    const data = await this.notificationService.viewNotification(user)
    return {data,type:"notification"};
  };

  sendFinalMenu = async () => {
    const data = await this.menuItemService.addItemInFinalMenu();
    return { data, type: "message" };
  };

  async executeFunctionality(index: number, payload: any,user:any) {
    switch (index) {
      case 1:
        return this.rollOutItems(payload);
      case 2:
        return this.sendFinalMenu();
      case 3:
        return this.viewMenu();
      case 4:
        return this.viewNotification(user);
      case 5:
        return "logout";
      default:
        console.error("Invalid function index for admin");
    }
  }
}
