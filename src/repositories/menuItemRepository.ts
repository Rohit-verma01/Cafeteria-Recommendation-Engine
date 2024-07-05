import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import {
  DELETE_FOOD_ITEM_BY_NAME,
  DROP_TOP_VOTE,
  DROP_VOTE_COUNT,
  GET_ALL_MENU_ITEMS,
  GET_RECOMMENDATIONS,
  INSERT_FINAL_MENU,
  TOP_VOTE,
  UPDATE_FOOD_ITEM_SENTIMENTS_BY_ID,
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
    try {
      await pool.query(DELETE_FOOD_ITEM_BY_NAME, [name]);
      return { success: true, message: `${name} item deleted` };
    } catch (error) {
      console.error(`Error deleting menu item "${name}":`, error);
      return {
        success: true,
        message: `Failed to delete menu item "${name}".\n`,
      };
    }
  }

  async getItemName(itemId: number) {
    try {
      const query = `SELECT item_name FROM fooditem WHERE item_id = ?;`;
      const [rows] = await pool.query<RowDataPacket[any]>(query, [itemId]);
      return rows[0].item_name;
    } catch (error) {
      console.error(`Error getting menu item name:`, error);
      return "Error in getting name"
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
        await pool.query(UPDATE_PRICE, [foodPrice, foodName]);
        return { success: true, message: "Item price updated successfully\n" };
      } else if (availabilityStatus) {
        await pool.query(UPDATE_AVAILABILITY, [
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

  async addSentiments(score: number, sentiment: string, itemId: number) {
    try {
      const values = [score, sentiment, itemId];
      await pool.query(UPDATE_FOOD_ITEM_SENTIMENTS_BY_ID, values);
      return "Sentiments added successfully\n";
    } catch (error) {
      console.error("Error in adding the sentiments:", error);
      return "Failed to adding the sentiments.\n";
    }
  }

  async getMenuWithRecommendation() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(GET_RECOMMENDATIONS);
      return rows;
    } catch (error) {
      console.error("Error in getting the recommendation:", error);
      return "Failed to view the recommendation.\n";
    }
  }
}
