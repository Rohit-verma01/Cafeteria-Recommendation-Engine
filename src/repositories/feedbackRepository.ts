import { pool } from "../config/db_connection";
import { GET_FEEDBACK_BY_FOOD_ID, INSERT_FEEDBACK } from "../queries/queries";

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
      return { success: true, message: "Feedback submitted successfully" };
    } catch (error: any) {
      if (error.sqlState === "45000") {
        return {
          success: false,
          message: `Already given feedback for item ${feedback.itemId} today.\n`,
        };
      } else {
        return {
          success: false,
          message: "An error occurred while submitting feedback.",
        };
      }
    }
  }

  async getFeedbackByItemId(itemId: number) {
    try {
      const [comments] = await pool.query(GET_FEEDBACK_BY_FOOD_ID, [itemId]);
      return comments;
    } catch (error: any) {
      return { success: false, message: "Unable to get feedbacks" };
    }
  }
}
