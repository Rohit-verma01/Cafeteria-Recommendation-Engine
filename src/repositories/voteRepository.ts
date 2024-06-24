import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_RECOMMENDED_MENU_ITEMS } from "../queries/userQueries";

export class VoteRepository {
  async viewRecommededItems() {
    const [rows] = await pool.query<RowDataPacket[]>(
      GET_ALL_RECOMMENDED_MENU_ITEMS
    );
    return rows;
  }
  async addVotes(voteList:any,user:any) {
    const values = voteList.map((item_id:number) => `(${item_id}, ${user.employee_id})`).join(', ');

    const query = `
      INSERT INTO vote (item_id, employee_id)
      VALUES ${values};
    `;
    await pool.query(query);
  }
}
