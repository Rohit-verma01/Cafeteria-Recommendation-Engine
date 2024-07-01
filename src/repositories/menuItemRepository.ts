import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import {
  DROP_TOP_VOTE,
  DROP_VOTE_COUNT,
  GET_ALL_MENU_ITEMS,
  INSERT_FINAL_MENU,
  TOP_VOTE,
  VOTE_COUNT,
} from "../queries/queries";
import {
  INSERT_FOODITEM,
  UPDATE_AVAILABILITY,
  UPDATE_PRICE,
  UPDATE_PRICE_AND_AVAILABILITY,
} from "../queries/queries";

export class MenuItemRepository {
  async getAllMenuItems() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(GET_ALL_MENU_ITEMS);
      return rows;
    } catch (error) {
      console.error("Error querying all menu items:", error);
      return "Failed to fetch menu items.\n";
    }
  }

  async addMenuItem(item: any) {
    const { foodName, price, categoryId } = item;
    try {
      await pool.query<RowDataPacket[]>(INSERT_FOODITEM, [
        foodName,
        price,
        categoryId,
      ]);
      return { success: true, message: "Item Added Successfully" };
    } catch (error) {
      console.error("Error adding menu item:", error);
      return { success: false, message: "Failed to add menu item.\n" };
    }
  }

  async deleteMenuItem(name: string) {
    const query = "DELETE FROM fooditem WHERE item_name = ?";
    try {
      await pool.execute(query, [name]);
      return { success: true, message: `${name} item deleted` };
    } catch (error) {
      console.error(`Error deleting menu item "${name}":`, error);
      return {
        success: true,
        message: `Failed to delete menu item "${name}".\n`,
      };
    }
  }

  async updateMenuItem(item: any): Promise<any> {
    const { foodName, foodPrice, availabilityStatus } = item;
    try {
      if (foodPrice && availabilityStatus) {
        await pool.execute(UPDATE_PRICE_AND_AVAILABILITY, [
          foodPrice,
          availabilityStatus === "true",
          foodName,
        ]);
        return {
          success: true,
          message: "Item price and availability updated successfully\n",
        };
      } else if (foodPrice) {
        await pool.execute(UPDATE_PRICE, [foodPrice, foodName]);
        return { success: true, message: "Item price updated successfully\n" };
      } else if (availabilityStatus) {
        await pool.execute(UPDATE_AVAILABILITY, [
          availabilityStatus === "true",
          foodName,
        ]);
        return {
          success: true,
          message: "Item availability updated successfully\n",
        };
      } else {
        return {
          success: false,
          message: "No updates were made as no new values were provided\n",
        };
      }
    } catch (error) {
      console.error(`Error updating menu item "${foodName}":`, error);
      return {
        success: false,
        message: `Failed to update menu item "${foodName}".\n`,
      };
    }
  }

  async finalizeTheMenu() {
    try {
      await pool.query(VOTE_COUNT);
      await pool.query(TOP_VOTE);
      await pool.query(INSERT_FINAL_MENU);
      await pool.query(DROP_VOTE_COUNT);
      await pool.query(DROP_TOP_VOTE);
      return "Menu finalized successfully\n";
    } catch (error) {
      console.error("Error finalizing the menu:", error);
      return "Failed to finalize the menu.\n";
    }
  }

  async addSentimentScore(score: number, itemId: number) {
    try {
      const query = `UPDATE fooditem SET sentiment_score = ? WHERE item_id = ?`;
      const values = [score, itemId];
      await pool.query(query, values);

      return "Score added successfully\n";
    } catch (error) {
      console.error("Error in adding the score:", error);
      return "Failed to adding the score.\n";
    }
  }

  async getMenuWithRecommendation() {
    try {
      const query = `
      SELECT 
        f.item_id AS itemId, 
        f.item_name AS item, 
        f.item_price AS price, 
        c.category_name AS category 
      FROM 
        fooditem f 
      JOIN 
        category c ON f.category_id = c.category_id 
      WHERE 
        f.is_available = 1
      ORDER BY 
        c.category_name, 
        f.sentiment_score DESC;
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows;

    } catch (error) {
      console.error("Error in getting the recommendation:", error);
      return "Failed to view the recommendation.\n";
    }
  }
}
