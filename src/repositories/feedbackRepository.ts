import { pool } from "../config/db_connection";
import { INSERT_FEEDBACK } from "../queries/queries";

export class FeedbackRepository {
  async sendFeedback(feedback: any, user: any) {
    const values = [
      feedback.itemId,
      user.employee_id,
      feedback.comment,
      feedback.rating,
    ];

    try {
      await pool.query(INSERT_FEEDBACK, values);
      return "Feedback submitted successfully";
    } catch (error: any) {
      if (error.sqlState === "45000") {
        return `Already given feedback for item ${feedback.itemId} today.`;
      } else {
        return "An error occurred while submitting feedback.";
      }
    }
  }
}
