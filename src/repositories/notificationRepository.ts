import { RowDataPacket } from "mysql2";
import { pool } from "../config/db_connection";

export class NotificationRepository {
  async addNotification(message:string,roleId:number) {
   
    console.log("message = ",message)
    try {
        const notificationQuery = `INSERT INTO notification (message, role_id) VALUES (?,?)`;
        await pool.query(notificationQuery, [message,roleId]);
        return {sucess:true,message:"Notification Added"}
        
    } catch (error) {
        return {sucess:false,message:"Failed to add notification"}
    }

  }
}
