import { DiscardMenuRepsitory } from "../repositories/discardMenuRepository";
import { MenuItemService } from "./menuItemService";
import { NotificationService } from "./notificationService";

export class DiscardItemService {
  private discardMenuRepository: DiscardMenuRepsitory;
  private menuItemService: MenuItemService;
  private notificationService: NotificationService;

  constructor() {
    this.discardMenuRepository = new DiscardMenuRepsitory();
    this.menuItemService = new MenuItemService();
    this.notificationService = new NotificationService();
  }

  async viewDiscardMenu() {
    try {
      return await this.discardMenuRepository.getDiscardMenuItem();
    } catch (error) {
      console.error(
        "Error in service while fetching discard menu items:",
        error
      );
      return "Failed to fetch discard menu items.";
    }
  }

  async removeItem(payload: any, user: any) {
    try {
      const success = await this.discardMenuRepository.checkRemoveAction(
        user.employee_id
      );
      if (success) {
        const data = await this.menuItemService.deleteItem(payload);
        if (data.success) {
          await this.notificationService.sendDeleteItemNotification(payload, 3);
        }
        return { data: data.message, type: "message" };
      }
      return {data:"You already did it once in a month. Try again in next month."}
    } catch (error) {
        return{data:"You only able to performed it once a month",type:"message"}
    }
  }

  async addItemInDetailedFeedback(payload: any, user: any) {
    try {
      const success = await this.discardMenuRepository.checkFeedbackAction(
        user.employee_id
      );
      if (success) {
        const data = await this.discardMenuRepository.addItemInFeedbackDiscardItem(payload);
        if (data) {
          const result = await this.notificationService.sendDetailedFeedbackNotification(payload, 3);
          return result.success;
        }
      }
      return false
    } catch (error) {
      console.error(
        "Error in service while adding item in detailed feedback:",
        error
      );
      return "Failed to add item in detailed feedback.";
    }
  }
}
