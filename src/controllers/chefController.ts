import { DiscardItemService } from "../services/discardItemService";
import { MenuItemService } from "../services/menuItemService";
import { NotificationService } from "../services/notificationService";
import { RecommendedMenuService } from "../services/recommendedMenuService";
import { UserService } from "../services/userService";
import { UserActivity } from "../utils/constants";

export class ChefController {
  private menuItemService: MenuItemService;
  private discardItemService: DiscardItemService;
  private notificationService: NotificationService;
  private userService: UserService;
  private recommendedMenuService: RecommendedMenuService;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.discardItemService = new DiscardItemService();
    this.notificationService = new NotificationService();
    this.userService = new UserService();
    this.recommendedMenuService = new RecommendedMenuService();
  }

  rollOutItems = async (payload: any, employeeId: number) => {
    await this.userService.addUserActivity(
      employeeId,
      UserActivity.ROLL_OUT_ITEMS
    );
    const data = await this.recommendedMenuService.addItemInRecommendedMenu(payload);
    if (data.success) {
      await this.notificationService.sendRollOutNotification(payload, 3);
      return { data: data.message, type: "message" };
    }
    return { data: data.message, type: "message" };
  };

  viewDiscardMenu = async (user:any) => {
    await this.userService.addUserActivity(
      user,
      UserActivity.VIEW_DISCARD_MENU
    );
    const data = await this.discardItemService.viewDiscardMenu();
    return { data, type: "discardItem" };
  };

  viewMenu = async (employeeId: number) => {
    await this.userService.addUserActivity(employeeId, UserActivity.VIEW_MENU);
    const data = await this.menuItemService.viewMenu();
    return { data, type: "foodItem" };
  };

  viewNotification = async (user: any) => {
    await this.userService.addUserActivity(
      user.employee_id,
      UserActivity.VIEW_NOTIFICATION
    );
    const data = await this.notificationService.viewNotification(user);
    return { data, type: "notification" };
  };

  sendFinalMenu = async (employeeId: number,payload:any) => {
    await this.userService.addUserActivity(
      employeeId,
      UserActivity.SEND_FINAL_MENU
    );
    const data = await this.menuItemService.addItemInFinalMenu(payload);
    return { data, type: "message" };
  };

  addItemInDetailedFeedback = async (payload: any, user: any) => {
    await this.userService.addUserActivity(user.employee_id,UserActivity.ADD_ITEM_FOR_DETAILED_FEEDBACK);
    const result = await this.discardItemService.addItemInDetailedFeedback(
      payload,
      user
    );
    if (result)
      return { data: "Item added for detailed feedback", type: "message" };
    else
      return {
        data: "You only did it once in a month. Please try it in next month",
        type: "message",
      };
  };

  removeItem = async (payload: any, user: any) => {
    await this.userService.addUserActivity(user.employee_id,UserActivity.REMOVE_THORUGH_DISCARD);
    return await this.discardItemService.removeItem(payload, user);
  };

  async executeFunctionality(index: number, payload: any, user: any) {
    switch (index) {
      case 1:
        return this.rollOutItems(payload, user.employee_id);
      case 2:
        return this.sendFinalMenu(user.employee_id,payload);
      case 3:
        return this.viewMenu(user.employee_id);
      case 4:
        return this.viewNotification(user);
      case 5:
        return this.viewDiscardMenu(user);
      case 6:
        await this.userService.addUserActivity(user.employee_id,UserActivity.LOGOUT);
        return "logout";
      case 7:
        return this.removeItem(payload, user);
      case 8:
        return this.addItemInDetailedFeedback(payload, user);
      default:
        console.error("Invalid function index for admin");
    }
  }
}
