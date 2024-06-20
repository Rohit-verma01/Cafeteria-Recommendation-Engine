export const GET_USER_BY_ID = 'SELECT * FROM user WHERE employee_id = ?';
export const GET_ROLE_BY_ID = 'SELECT * FROM role WHERE role_id = ?';
export const INSERT_FOODITEM = 'INSERT INTO fooditem (item_name, item_price, category_id) VALUES (?, ?, ?)';
export const UPDATE_PRICE = 'UPDATE fooditem SET item_price = ? WHERE item_name = ?';
export const UPDATE_AVAILABILITY = 'UPDATE fooditem SET is_available = ? WHERE item_name = ?';
export const UPDATE_PRICE_AND_AVAILABILITY = 'UPDATE fooditem SET item_price = ?, is_available = ? WHERE item_name = ?';
