import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_MENU_ITEMS } from "../queries/queries";
import { INSERT_FOODITEM, UPDATE_AVAILABILITY, UPDATE_PRICE, UPDATE_PRICE_AND_AVAILABILITY } from "../queries/queries";

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
      return "Item Added Successfully";
    } catch (error) {
      console.error("Error adding menu item:", error);
      return "Failed to add menu item.\n";
    }
  }

  async deleteMenuItem(name: string) {
    const query = "DELETE FROM fooditem WHERE item_name = ?";
    try {
      await pool.execute(query, [name]);
      return `${name} item deleted`;
    } catch (error) {
      console.error(`Error deleting menu item "${name}":`, error);
      return `Failed to delete menu item "${name}".\n`;
    }
  }

  async updateMenuItem(item: any): Promise<any> {
    const { foodName, foodPrice, availabilityStatus } = item;
    try {
      if (foodPrice && availabilityStatus) {
        await pool.execute(UPDATE_PRICE_AND_AVAILABILITY, [
          foodPrice,
          availabilityStatus,
          foodName,
        ]);
        return "Item price and availability updated successfully\n";
      } else if (foodPrice) {
        await pool.execute(UPDATE_PRICE, [foodPrice, foodName]);
        return "Item price updated successfully\n";
      } else if (availabilityStatus) {
        await pool.execute(UPDATE_AVAILABILITY, [availabilityStatus, foodName]);
        return "Item availability updated successfully\n";
      } else {
        return "No updates were made as no new values were provided\n";
      }
    } catch (error) {
      console.error(`Error updating menu item "${foodName}":`, error);
      return `Failed to update menu item "${foodName}".\n`;
    }
  }
}
