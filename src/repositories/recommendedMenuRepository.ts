import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_RECOMMENDED_MENU_ITEMS } from "../queries/queries";

export class RecommendedMenuRepository {
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
      return {success:true,message:"Items added in recommended menu successfully\n"};
    } catch (error) {
      console.error("Error adding items to recommended menu:", error);
      return {success:false,message:"Failed to add items to recommended menu.\n"};
    }
  }
}
