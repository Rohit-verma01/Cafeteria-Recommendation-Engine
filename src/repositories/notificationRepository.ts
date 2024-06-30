import { RowDataPacket } from "mysql2";
import { pool } from "../config/db_connection";

export class NotificationRepository {
  async addNotification(message: string, roleId: number,type: 'rollout_menu' | 'item_change') {
    console.log("message = ", message);
    try {
      const notificationQuery = `INSERT INTO notification (message, role_id,type) VALUES (?,?,?)`;
      await pool.query(notificationQuery, [message, roleId,type]);
      return { sucess: true, message: "Notification Added" };
    } catch (error) {
      return { sucess: false, message: "Failed to add notification" };
    }
  }

  async getNotification(user: any) {
    try {
      const { role_id, employee_id } = user;

      // Fetch unseen notifications based on role_id and user_id
      const [unseenNotifications] = await pool.query<RowDataPacket[]>(`
        SELECT n.notification_id, n.message
        FROM notification n
        LEFT JOIN usernotification un ON n.notification_id = un.notification_id AND un.employee_id = ?
        WHERE n.role_id = ?
          AND un.notification_id IS NULL
          AND (n.type != 'rollout_menu' OR (n.type = 'rollout_menu' AND n.date = CURRENT_DATE))
      `, [employee_id, role_id]);

      console.log("data = ",unseenNotifications);
      // Extract messages from unseen notifications
      const unseenMessages = unseenNotifications.map((notif) => notif.message);

      // Insert the unseen notifications into the usernotification table
      if (unseenNotifications.length > 0) {
        const insertValues = unseenNotifications.map((notif) => [
          employee_id,
          notif.notification_id,
        ]);
        console.log("Insert values = ",insertValues)
        await pool.query(
          `
            INSERT INTO usernotification (employee_id, notification_id)
            VALUES ?
          `,
          [insertValues]
        );
      }
      return unseenMessages;
      
    } catch (error) {
      return "Failed to view notification";
    }
  }
}
