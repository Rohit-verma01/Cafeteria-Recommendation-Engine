import { RowDataPacket } from "mysql2";
import { pool } from "../config/db_connection";
import {
  GET_UNSEEN_NOTIFICATIONS,
  INSERT_INTO_USER_NOTIFICATION,
  INSERT_NOTIFICATION,
} from "../queries/queries";

export class NotificationRepository {
  async addNotification(
    message: string,
    roleId: number,
    type: "rollout_menu" | "item_change"
  ) {
    try {
      await pool.query(INSERT_NOTIFICATION, [message, roleId, type]);
      return { success: true, message: "Notification Added" };
    } catch (error) {
      return { success: false, message: "Failed to add notification" };
    }
  }

  async getNotification(user: any) {
    try {
      const { role_id, employee_id } = user;
      const [unseenNotifications] = await pool.query<RowDataPacket[]>(
        GET_UNSEEN_NOTIFICATIONS,
        [employee_id, role_id]
      );
      const unseenMessages = unseenNotifications.map((notif) => notif.message);

      if (unseenNotifications.length > 0) {
        const insertValues = unseenNotifications.map((notif) => [
          employee_id,
          notif.notification_id,
        ]);
        await pool.query(INSERT_INTO_USER_NOTIFICATION, [insertValues]);
      }
      return unseenMessages;
    } catch (error) {
      console.log("Error while getting notification: ",error)
      throw error;
    }
  }
}
