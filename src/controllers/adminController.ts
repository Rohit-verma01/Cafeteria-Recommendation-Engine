import { MenuItemService } from "../services/menuItemService";
import { NotificationService } from "../services/notificationService";

export class AdminController {
  private menuItemService: MenuItemService;
  private notificationService: NotificationService;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.notificationService = new NotificationService();
  }

  viewMenu = async () => {
    const data = await this.menuItemService.viewMenu();
    return {data,type:"foodItem"}
  };

  addMenuItem = async (payload: any) => {
    const data = await this.menuItemService.addItem(payload);
    if(data.success){
      await this.notificationService.sendAddItemNotification(payload.foodName,2);
      await this.notificationService.sendAddItemNotification(payload.foodName,3);
      return {data:data.message,type:"message"}
    }
    return {data,type:"message"}
  };

  deleteMenuItem = async(payload:any) => {
    const data = await this.menuItemService.deleteItem(payload);
    if(data.success){
      await this.notificationService.sendDeleteItemNotification(payload,2);
      await this.notificationService.sendDeleteItemNotification(payload,3);
    }
    return {data:data.message,type:"message"}
  };

  updateMenuItem = async (payload: any) => {
    const data = await this.menuItemService.updateItem(payload);
    if(data.success){
      await this.notificationService.sendUpdateItemNotification(payload,2);
      await this.notificationService.sendUpdateItemNotification(payload,3);
      return {data:data.message,type:"message"}
    }
    return {data:data.message,type:"message"}
  };

  viewRecommendation = async () => {
   const data = await this.menuItemService.viewRecommendationMenu();
   return {data,type:"foodItem"}
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
      case 5:
        return "logout";
      case 6:
        return this.viewRecommendation();
      default:
        console.error("Invalid function index for admin");
    }
  }
}
