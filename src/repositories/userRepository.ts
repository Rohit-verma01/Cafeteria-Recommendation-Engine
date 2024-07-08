import { pool } from "../config/db_connection";
import { GET_ROLE_BY_ID, GET_USER_BY_ID } from "../queries/queries";
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
      return "Failed to fetch user details.\n";
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
      return "Failed to fetch role details\n";
    }
  }

  async updateProfileById(payload: any, id: number) {
    const { dietType, spicyLevel, prefer, likeSweet } = payload;

    const checkQuery = "SELECT COUNT(*) AS count FROM employee WHERE id = ?";
    const insertQuery = `
    INSERT INTO employee (id, diet_preference, spice_level, cuisine_preference, is_sweet_tooth)
    VALUES (?, ?, ?, ?, ?)
  `;
    const updateQuery = `
    UPDATE employee
    SET diet_preference = ?, spice_level = ?, cuisine_preference = ?, is_sweet_tooth = ?
    WHERE id = ?
  `;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(checkQuery, [id]);
      const count = rows[0].count;

      if (count == 0) {
        await pool.query(insertQuery, [
          id,
          dietType,
          spicyLevel,
          prefer,
          likeSweet,
        ]);
      } else {
        await pool.query(updateQuery, [
          dietType,
          spicyLevel,
          prefer,
          likeSweet,
          id,
        ]);
      }

      return "Employee profile updated successfully.\n";
    } catch (error) {
      console.error("Error while updating the employee profile:", error);
      return "Failed to update employee profile.\n";
    }
  }
}
