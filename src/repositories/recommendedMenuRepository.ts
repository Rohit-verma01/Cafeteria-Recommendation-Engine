import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import {
  CHECK_IF_RECOMMENDED_MENU_EXISTS,
  GET_ALL_RECOMMENDED_MENU_ITEMS,
  GET_TODAY_RECOMMENDED_MENU_WITH_VOTES,
} from "../queries/queries";

export class RecommendedMenuRepository {
  async viewRecommededItems(employeeId: number) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        GET_ALL_RECOMMENDED_MENU_ITEMS,
        [employeeId]
      );
      return rows;
    } catch (error) {
      console.error("Error querying recommended menu items:", error);
      throw error;
    }
  }

  async checkRollOut() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        CHECK_IF_RECOMMENDED_MENU_EXISTS
      );
      return rows.length > 0;
    } catch (error) {
      console.error("Error while checking recommended menu:", error);
      throw error;
    }
  }

  async selectFromRollOut() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        GET_TODAY_RECOMMENDED_MENU_WITH_VOTES
      );
      return rows;
    } catch (error) {
      console.error("Error while selecting from recommended menu:", error);
      throw error;
    }
  }

  async addItem(values: any) {
    const query = `INSERT INTO RecommendedMenu (item_id, meal_type_id) VALUES ${values}`;
    try {
      await pool.execute(query);
      return {
        success: true,
        message: "Items added in recommended menu successfully\n",
      };
    } catch (error) {
      console.error("Error adding items to recommended menu:", error);
      throw error;
    }
  }
}
