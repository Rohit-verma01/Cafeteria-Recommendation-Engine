import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_RECOMMENDED_MENU_ITEMS } from "../queries/queries";

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
      return "Failed to fetch recommended menu items.";
    }
  }

  async checkRollOut() {
    try {
      const query = `
        SELECT 1 
        FROM recommendedmenu 
        WHERE date = CURRENT_DATE;
      `;
      const [rows] = await pool.query<RowDataPacket[]>(query);
      return rows.length > 0;
    } catch (error) {
      console.error("Error while checking recommended menu:", error);
      throw error;
    }
  }

  async selectFromRollOut() {
    try {
      const query = `
      SELECT 
        rm.item_id AS item_id,
        fi.item_name AS itemName,
        mt.meal_type AS meal_type,
        COALESCE(vote_counts.votes, 0) AS votes
      FROM recommendedmenu rm
      JOIN fooditem fi ON rm.item_id = fi.item_id
      JOIN mealtype mt ON rm.meal_type_id = mt.meal_type_id
      LEFT JOIN (
        SELECT item_id, COUNT(*) AS votes
        FROM vote
        WHERE date = CURRENT_DATE
        GROUP BY item_id
      ) vote_counts ON rm.item_id = vote_counts.item_id
      WHERE rm.date = CURRENT_DATE;
    `;
      const [rows] = await pool.query<RowDataPacket[]>(query);
      return rows;
    } catch (error) {
      console.error("Error while selecting from recommended menu:", error);
      throw error;
    }
  }
  async addItem(recommendedList: any) {
    const { breakfast, lunch, dinner } = recommendedList;

    const breakfastValues = breakfast
      .map((itemId: number) => `(${itemId}, 1)`)
      .join(", ");
    const lunchValues = lunch
      .map((itemId: number) => `(${itemId}, 2)`)
      .join(", ");
    const dinnerValues = dinner
      .map((itemId: number) => `(${itemId}, 3)`)
      .join(", ");

    const values = [breakfastValues, lunchValues, dinnerValues].join(", ");
    const query = `INSERT INTO RecommendedMenu (item_id, meal_type_id) VALUES ${values}`;

    try {
      await pool.execute(query);
      return {
        success: true,
        message: "Items added in recommended menu successfully\n",
      };
    } catch (error) {
      console.error("Error adding items to recommended menu:", error);
      return {
        success: false,
        message: "Failed to add items to recommended menu.\n",
      };
    }
  }
}
