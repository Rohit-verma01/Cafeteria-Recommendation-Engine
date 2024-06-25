import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_RECOMMENDED_MENU_ITEMS } from "../queries/userQueries";

export class FeedbackRepository {
    async sendFeedback(feedback: any, user: any) {
        console.log(feedback);
      
        const values = [
          feedback.itemId,
          user.employee_id,
          feedback.comment,
          feedback.rating,
        ];
        console.log(values, "here is value");
      
        const insertQuery = `
          INSERT INTO feedback (item_id, employee_id, comment, rating, date) VALUES (?,?,?,?, NOW());
        `;
      
        try {
          await pool.query(insertQuery, values);
          return "Feedback submitted successfully";
        } catch (error:any) {
          if (error.sqlState === '45000') {
            throw new Error(`Already given feedback for item ${feedback.itemId} today.`);
          } else {
            throw new Error('An error occurred while submitting feedback.');
          }
        }
      }
      
  async addVotes(voteList: any, user: any) {
    const values = voteList
      .map((item_id: number) => `(${item_id}, ${user.employee_id})`)
      .join(", ");

    const query = `
      INSERT INTO vote (item_id, employee_id)
      VALUES ${values};
    `;
    await pool.query(query);
  }
}
