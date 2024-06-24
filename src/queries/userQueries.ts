export const GET_USER_BY_ID = 'SELECT * FROM user WHERE employee_id = ?';
export const GET_ROLE_BY_ID = 'SELECT * FROM role WHERE role_id = ?';
export const INSERT_FOODITEM = 'INSERT INTO fooditem (item_name, item_price, category_id) VALUES (?, ?, ?)';
export const UPDATE_PRICE = 'UPDATE fooditem SET item_price = ? WHERE item_name = ?';
export const UPDATE_AVAILABILITY = 'UPDATE fooditem SET is_available = ? WHERE item_name = ?';
export const UPDATE_PRICE_AND_AVAILABILITY = 'UPDATE fooditem SET item_price = ?, is_available = ? WHERE item_name = ?';
export const GET_ALL_MENU_ITEMS = "SELECT f.item_id AS itemId, f.item_name AS item, f.item_price AS price, c.category_name AS category FROM fooditem f JOIN category c ON f.category_id = c.category_id ORDER BY c.category_name;"
export const GET_ALL_RECOMMENDED_MENU_ITEMS = `SELECT rm.item_id,f.item_name,mt.meal_type,mt.meal_type_id,f.category_id,c.category_name FROM RecommendedMenu rm JOIN fooditem f ON rm.item_id = f.item_id JOIN mealtype mt ON rm.meal_type_id = mt.meal_type_id JOIN category c ON f.category_id = c.category_id;
`