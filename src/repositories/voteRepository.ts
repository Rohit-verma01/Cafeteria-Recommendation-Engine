import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_RECOMMENDED_MENU_ITEMS } from "../queries/userQueries";

export class VoteRepository {
  async viewRecommededItems() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        GET_ALL_RECOMMENDED_MENU_ITEMS
      );
      return rows;
    } catch (error) {
      console.error("Error querying recommended menu items:", error);
      return "Failed to fetch recommended menu items.";
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
      console.error("Error adding votes:", error);
      return "Failed to add votes.";
    }
  }
}
