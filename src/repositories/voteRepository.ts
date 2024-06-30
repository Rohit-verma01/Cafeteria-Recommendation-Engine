import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import {
  INSERT_VOTES,
} from "../queries/queries";

export class VoteRepository {
  async countUserVote(employeeId: number) {
    const CHECK_VOTE_TODAY = `
        SELECT COUNT(*) AS count_votes
        FROM vote
        WHERE employee_id = ?
          AND date = CURRENT_DATE
    `;
    try {
      const [rows] = await pool.query<RowDataPacket[]>(CHECK_VOTE_TODAY, [
        employeeId,
      ]);
      const countVotes = rows[0].count_votes;
      console.log("Count = ",countVotes)
      if (countVotes > 0) {
        return "Already voted today.\n";
      }
        return "";
    } catch (error) {
      console.error("Error checking vote count for the user:", error);
      return "Failed to count the votes.\n";
    }
  }

  async addVotes(voteList: any, user: any) {
    const values = voteList.map((item_id: number) => [
      item_id,
      user.employee_id,
    ]);
    try {
      await pool.query(INSERT_VOTES, [values]);
      return "Votes added successfully\n";
    } catch (error: any) {
        return "Failed to add votes.\n";
    }
  }
}
