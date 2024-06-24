import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_RECOMMENDED_MENU_ITEMS } from "../queries/userQueries";

export class RecommendedMenuRepository {
  async viewRecommededItems() {
    const [rows] = await pool.query<RowDataPacket[]>(
      GET_ALL_RECOMMENDED_MENU_ITEMS
    );
    return rows;
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
    await pool.execute(query);
    return "Items added in recommended menu successfully";
  }
}
