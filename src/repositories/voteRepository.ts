import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_RECOMMENDED_MENU_ITEMS, INSERT_VOTES } from "../queries/queries";

export class VoteRepository {
  async viewRecommededItems() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        GET_ALL_RECOMMENDED_MENU_ITEMS
      );
      return rows;
    } catch (error) {
      console.error("Error querying recommended menu items:", error);
      return "Failed to fetch recommended menu items.\n";
    }
  }

  async addVotes(voteList: any, user: any) {
    const values = voteList.map((item_id:number) => [item_id, user.employee_id]);
    try {
      await pool.query(INSERT_VOTES,[values]);
      return "Votes added successfully\n";
    } catch (error) {
      console.error("Error adding votes:", error);
      return "Failed to add votes.\n";
    }
  }
}
