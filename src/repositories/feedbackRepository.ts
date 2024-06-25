import { pool } from "../config/db_connection";

export class FeedbackRepository {
  async sendFeedback(feedback: any, user: any) {
    const values = [
      feedback.itemId,
      user.employee_id,
      feedback.comment,
      feedback.rating,
    ];

    const insertQuery = `
      INSERT INTO feedback (item_id, employee_id, comment, rating, date) VALUES (?,?,?,?, NOW());
    `;

    try {
      await pool.query(insertQuery, values);
      return "Feedback submitted successfully";
    } catch (error: any) {
      if (error.sqlState === "45000") {
        return `Already given feedback for item ${feedback.itemId} today.`;
      } else {
        return "An error occurred while submitting feedback.";
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

    try {
      await pool.query(query);
      return "Votes added successfully";
    } catch (error) {
      return "An error occurred while adding votes.";
    }
  }
}
