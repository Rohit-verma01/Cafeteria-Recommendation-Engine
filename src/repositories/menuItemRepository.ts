import { pool } from "../config/db_connection";
import { RowDataPacket } from "mysql2";

export class MenuItemRepository {
    async getAllMenuItems(): Promise<any[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM MenuItem');
        return rows;
    }

    async addMenuItem(item: any) {
        const { foodName, price, categoryId } = item;
        const query = 'INSERT INTO fooditem (item_name, item_price, category_id) VALUES (?, ?, ?)';
        await pool.execute(query, [foodName, price, categoryId]);
        return "Item Added Successfully"
    }

    async deleteMenuItem(itemId: number): Promise<void> {
        const query = 'DELETE FROM MenuItem WHERE id = ?';
        await pool.execute(query, [itemId]);
        console.log("Menu item deleted with ID:", itemId);
    }

    async updateMenuItem(item: { id: number; item_name: string; item_price: number; category_id: number }): Promise<void> {
        const { id, item_name, item_price, category_id } = item;
        const query = 'UPDATE MenuItem SET item_name = ?, item_price = ?, category_id = ? WHERE id = ?';
        await pool.execute(query, [item_name, item_price, category_id, id]);
        console.log("Menu item updated:", item);
    }
}
