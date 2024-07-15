import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import {
  CHECK_IF_FINAL_MENU_EXISTS,
  DELETE_FOOD_ITEM_BY_NAME,
  GET_ALL_MENU_ITEMS,
  GET_ITEM_BY_ID,
  GET_RECOMMENDATIONS,
  INSERT_FINAL_MENU,
  UPDATE_FOOD_ITEM_SENTIMENTS_BY_ID,
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
      throw error;
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
      throw error;
    }
  }

  async deleteMenuItem(name: string) {
    try {
      await pool.query(DELETE_FOOD_ITEM_BY_NAME, [name]);
      return { success: true, message: `${name} item deleted` };
    } catch (error) {
      console.error(`Error deleting menu item "${name}":`, error);
      throw error;
    }
  }

  async getItemName(itemId: number) {
    try {
      const [rows] = await pool.query<RowDataPacket[any]>(GET_ITEM_BY_ID, [itemId]);
      return rows[0].item_name;
    } catch (error) {
      console.error(`Error getting menu item name:`, error);
      throw error;
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
     throw error;
    }
  }

  async finalizeTheMenu(items:any) {
    try {
      const values = items.map((item:any) => [item]);
      await pool.query(INSERT_FINAL_MENU, [values]);
      return "Menu finalized successfully\n";
    } catch (error) {
      console.error("Error finalizing the menu:", error);
      throw error;
    }
  }

  async addSentiments(score: number, sentiment: string, itemId: number) {
    try {
      const values = [score, sentiment, itemId];
      await pool.query(UPDATE_FOOD_ITEM_SENTIMENTS_BY_ID, values);
      return "Sentiments added successfully\n";
    } catch (error) {
      console.error("Error in adding the sentiments:", error);
      throw error;
    }
  }

  async getMenuWithRecommendation() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(GET_RECOMMENDATIONS);
      return rows;
    } catch (error) {
      console.error("Error in getting the recommendation:", error);
      throw error;
    }
  }

    async checkFinalMenu(){
      try {
        const [rows] = await pool.query<RowDataPacket[]>(CHECK_IF_FINAL_MENU_EXISTS);
        return rows.length>0;
      } catch (error) {
        console.error("Error while checking final menu:", error);
        throw error;
      }
    }
}
