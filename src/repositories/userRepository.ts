import { pool } from "../config/db_connection";
import { GET_ROLE_BY_ID, GET_USER_BY_ID } from "../queries/userQueries";
import { IUser, IRole } from "../types";
import { RowDataPacket } from "mysql2";

export class UserRepository {
  async getUserById(id: number) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(GET_USER_BY_ID, [id]);
      if (rows.length > 0) {
        const user: IUser = {
          employee_id: rows[0].employee_id,
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          role_id: rows[0].role_id,
        };
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error querying the database:", error);
      return "Failed to fetch user details";
    }
  }

  async getRoleById(roleId: number) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query<RowDataPacket[]>(GET_ROLE_BY_ID, [
        roleId,
      ]);
      connection.release();

      if (rows.length > 0) {
        const role: IRole = {
          role_id: rows[0].role_id,
          role_name: rows[0].role_name,
        };
        return role;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error querying the database:", error);
      return "Failed to fetch role details";
    }
  }
}
