import { RowDataPacket } from "mysql2";
import { pool } from "../config/db_connection";
import { FeedbackRepository } from "../repositories/feedbackRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { MenuItemService } from "./menuItemService";

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private menuItemService: MenuItemService;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.menuItemService = new MenuItemService();
  }

  async sendRollOutNotification(item: any, roleId: number) {
    try {
      const allItemIds = [...item.breakfast, ...item.lunch, ...item.dinner];
      const placeholders = allItemIds.map(() => "?").join(",");

      const query = `SELECT item_id, item_name FROM fooditem WHERE item_id IN (${placeholders})`;

      const [rows] = await pool.query<RowDataPacket[]>(query, allItemIds);
      const breakfastNames = rows
        .filter((row) => item.breakfast.includes(row.item_id))
        .map((row) => row.item_name);
      const lunchNames = rows
        .filter((row) => item.lunch.includes(row.item_id))
        .map((row) => row.item_name);
      const dinnerNames = rows
        .filter((row) => item.dinner.includes(row.item_id))
        .map((row) => row.item_name);

      const message = `The following items are rolled out: 
                     Breakfast: ${breakfastNames.join(", ")}, 
                     Lunch: ${lunchNames.join(", ")}, 
                     Dinner: ${dinnerNames.join(", ")}. 
                     You can now vote for them.`;
      await this.notificationRepository.addNotification(
        message,
        roleId,
        "rollout_menu"
      );
    } catch (error) {
      console.error(
        "Unknown error in Notification Service while sending notification:",
        error
      );
    }
  }

  async sendAddItemNotification(item: string, roleId: number) {
    try {
      const message = `${item} is newly added in the menu`;
      return await this.notificationRepository.addNotification(
        message,
        roleId,
        "item_change"
      );
    } catch (error) {
      console.error(
        "Unknown error in Notification Service while sending notification:",
        error
      );
      return { success: false, message: "Failed to send notification." };
    }
  }

  async sendDeleteItemNotification(item: string, roleId: number) {
    try {
      const message = `${item} is deleted from the menu`;
      return await this.notificationRepository.addNotification(
        message,
        roleId,
        "item_change"
      );
    } catch (error) {
      console.error(
        "Unknown error in Notification Service while sending notification:",
        error
      );
      return { success: false, message: "Failed to send notification." };
    }
  }

  async sendDetailedFeedbackNotification(itemId: number, roleId: number) {
    try {
      const itemName = await this.menuItemService.getItemName(itemId);
      const message = `We are trying to improve your experience with ${itemName}. Please provide your feedback by giving detailed feedback and help us.`;
      return await this.notificationRepository.addNotification(
        message,
        roleId,
        "item_change"
      );
    } catch (error) {
      console.error(
        "Unknown error in Notification Service while sending notification:",
        error
      );
      return { success: false, message: "Failed to send notification." };
    }
  }

  async sendUpdateItemNotification(item: any, roleId: number) {
    try {
      const { foodName, foodPrice, availabilityStatus } = item;
      let message = "";
      if (foodPrice && availabilityStatus) {
        message = `${foodName} price and availability status has been changed.`;
      } else if (foodPrice) {
        message = `${foodName} price has been changed.`;
      } else if (availabilityStatus) {
        message = `${foodName} availability status has been changed.`;
      }
      return await this.notificationRepository.addNotification(
        message,
        roleId,
        "item_change"
      );
    } catch (error) {
      console.error(
        "Unknown error in Notification Service while sending notification:",
        error
      );
      return { success: false, message: "Failed to send notification." };
    }
  }

  async viewNotification(user: any) {
    try {
      return await this.notificationRepository.getNotification(user);
    } catch (error) {
      console.error(
        "Unknown error in Notification Service while viewing notification:",
        error
      );
      return "Failed to view notification.";
    }
  }
}
