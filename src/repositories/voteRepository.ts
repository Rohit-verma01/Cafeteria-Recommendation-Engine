import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { CHECK_VOTE_TODAY, INSERT_VOTES } from "../queries/queries";

export class VoteRepository {
  async countUserVote(employeeId: number) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(CHECK_VOTE_TODAY, [
        employeeId,
      ]);
      const countVotes = rows[0].count_votes;
      if (countVotes > 0) {
        return "Already voted today.\n";
      }
      return "";
    } catch (error) {
      console.error("Error checking vote count for the user:", error);
      return "Failed to count the votes.\n";
    }
  }

  async addVotes(voteList: any) {
    try {
      await pool.query(INSERT_VOTES, [voteList]);
      return "Votes added successfully\n";
    } catch (error: any) {
      throw(error)
    }
  }
}
