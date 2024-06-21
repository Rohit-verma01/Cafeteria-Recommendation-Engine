import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";
import { GET_ALL_ITEMS, INSERT_FOODITEM, UPDATE_AVAILABILITY, UPDATE_PRICE, UPDATE_PRICE_AND_AVAILABILITY } from "../queries/userQueries";

export class RecommendedMenuRepository {
    async getAllMenuItems(): Promise<any[]> {
        const [rows] = await pool.query<RowDataPacket[]>(GET_ALL_ITEMS);
        return rows;
    }

    async addMenuItem(item: any) {
        const { foodName, price, categoryId } = item;
        await pool.query<RowDataPacket[]>(INSERT_FOODITEM, [foodName, price, categoryId]);
        return "Item Added Successfully"
    }

    async deleteMenuItem(name: string){
        const query = 'DELETE FROM fooditem WHERE item_name = ?';
        await pool.execute(query, [name]);
        return `${name} item deleted`
    }

    async updateMenuItem(item: any): Promise<any> {
        const {foodName,foodPrice,availabilityStatus } = item;
        if (foodPrice && availabilityStatus) {
            await pool.execute(UPDATE_PRICE_AND_AVAILABILITY, [foodPrice, availabilityStatus, foodName]);
            return "Item price and availability updated successfully";
        } else if (foodPrice) {
            await pool.execute(UPDATE_PRICE, [foodPrice, foodName]);
            return "Item price updated successfully";
        } else if (availabilityStatus) {
            await pool.execute(UPDATE_AVAILABILITY, [availabilityStatus, foodName]);
            return "Item availability updated successfully";
        } else {
            return "No updates were made as no new values were provided";
        }
    }
}
