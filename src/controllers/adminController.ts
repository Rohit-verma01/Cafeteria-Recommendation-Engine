import { MenuItemService } from "../services/menuItemService";
import { NotificationService } from "../services/notificationService";
import { UserService } from "../services/userService";
import { UserActivity } from "../utils/constants";

export class AdminController {
  private menuItemService: MenuItemService;
  private notificationService: NotificationService;
  private userService: UserService;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.notificationService = new NotificationService();
    this.userService = new UserService();
  }

  viewMenu = async (employeeId:number) => {
    await this.userService.addUserActivity(employeeId, UserActivity.VIEW_MENU);
    const data = await this.menuItemService.viewMenu();
    return { data, type: "foodItem" };
  };

  addMenuItem = async (payload: any, employeeId: number) => {
    await this.userService.addUserActivity(employeeId, UserActivity.ADD_ITEM);
    const data = await this.menuItemService.addItem(payload);
    if (data.success) {
      await this.notificationService.sendAddItemNotification(
        payload.foodName,
        2
      );
      await this.notificationService.sendAddItemNotification(
        payload.foodName,
        3
      );
      return { data: data.message, type: "message" };
    }
    return { data, type: "message" };
  };

  deleteMenuItem = async (payload: any,employeeId:number) => {
    await this.userService.addUserActivity(employeeId, UserActivity.DELETE_ITEM);
    const data = await this.menuItemService.deleteItem(payload);
    if (data.success) {
      await this.notificationService.sendDeleteItemNotification(payload, 2);
      await this.notificationService.sendDeleteItemNotification(payload, 3);
    }
    return { data: data.message, type: "message" };
  };

  updateMenuItem = async (payload: any,employeeId:number) => {
    await this.userService.addUserActivity(employeeId, UserActivity.UPDATE_ITEM);
    const data = await this.menuItemService.updateItem(payload);
    if (data.success) {
      await this.notificationService.sendUpdateItemNotification(payload, 2);
      await this.notificationService.sendUpdateItemNotification(payload, 3);
      return { data: data.message, type: "message" };
    }
    return { data: data.message, type: "message" };
  };

  viewRecommendation = async (employeeId:number) => {
    await this.userService.addUserActivity(employeeId, UserActivity.VIEW_RECOMMEDATION);
    const data = await this.menuItemService.viewRecommendationMenu();
    return { data, type: "foodItem" };
  };

  async executeFunctionality(index: number, payload: any, employeeId: number) {
    switch (index) {
      case 1:
        return this.addMenuItem(payload, employeeId);
      case 2:
        return this.updateMenuItem(payload, employeeId);
      case 3:
        return this.deleteMenuItem(payload,employeeId);
      case 4:
        return this.viewMenu(employeeId);
      case 5:
        await this.userService.addUserActivity(employeeId,UserActivity.LOGOUT);
        return "logout";
      case 6:
        return this.viewRecommendation(employeeId);
      default:
        console.error("Invalid function index for admin");
    }
  }
}
