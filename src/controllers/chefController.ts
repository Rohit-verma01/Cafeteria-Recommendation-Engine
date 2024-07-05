import { DiscardItemService } from "../services/discardItemService";
import { MenuItemService } from "../services/menuItemService";
import { NotificationService } from "../services/notificationService";

export class ChefController {
  private menuItemService: MenuItemService;
  private discardItemService: DiscardItemService;
  private notificationService: NotificationService;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.discardItemService = new DiscardItemService();
    this.notificationService = new NotificationService();
  }

  rollOutItems = async (payload: any) => {
    const data = await this.menuItemService.addItemInRecommendedMenu(payload);
    if (data.success) {
      await this.notificationService.sendRollOutNotification(payload, 3);
      return { data: data.message, type: "message" };
    }
    return { data: data.message, type: "message" };
  };

  viewDiscardMenu = async () => {
    const data = await this.discardItemService.viewDiscardMenu();
    return { data, type: "discardItem" };
  };
  viewMenu = async () => {
    const data = await this.menuItemService.viewMenu();
    return { data, type: "foodItem" };
  };

  viewNotification = async (user: any) => {
    const data = await this.notificationService.viewNotification(user);
    return { data, type: "notification" };
  };

  sendFinalMenu = async () => {
    const data = await this.menuItemService.addItemInFinalMenu();
    return { data, type: "message" };
  };

  addItemInDetailedFeedback = async(payload:any,user:any) => {
    const result  = await this.discardItemService.addItemInDetailedFeedback(payload,user);
    if(result)
      return {data:"Item added for detailed feedback",type:"message"}
    else
    return {data:"You only did it once in a month. Please try it in next month",type:"message"}
  };
  
 
  removeItem = async(payload:any,user:any) => {
    return await this.discardItemService.removeItem(payload,user)
  };

  async executeFunctionality(index: number, payload: any, user: any) {
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
        return this.viewDiscardMenu();
      case 6:
        return "logout";
      case 7:
        return this.removeItem(payload,user);
      case 8:
        return this.addItemInDetailedFeedback(payload,user)
      default:
        console.error("Invalid function index for admin");
    }
  }
}
