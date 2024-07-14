import { pool } from "../config/db_connection";
import {
  CHECK_EMPLOYEE_EXISTS,
  GET_ROLE_BY_ID,
  GET_USER_BY_ID,
  INSERT_EMPLOYEE_WITH_PREFERENCE,
  INSERT_USER_ACTIVITY,
  UPDATE_EMPLOYEE_WITH_PREFERENCE,
} from "../queries/queries";
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
      return "Enbale to fetch user"
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
    try {
      const [rows] = await pool.query<RowDataPacket[]>(CHECK_EMPLOYEE_EXISTS, [
        id,
      ]);
      const count = rows[0].count;

      if (count == 0) {
        await pool.query(INSERT_EMPLOYEE_WITH_PREFERENCE, [
          id,
          dietType,
          spicyLevel,
          prefer,
          likeSweet,
        ]);
      } else {
        await pool.query(UPDATE_EMPLOYEE_WITH_PREFERENCE, [
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

  async addActivity(employeeId:number,activity:string){
  try {
    await pool.execute(INSERT_USER_ACTIVITY, [employeeId, activity]);
  } catch (error) {
    console.error("Error adding activity:", error);
  }
  }
}
