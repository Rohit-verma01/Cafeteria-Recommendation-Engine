export const GET_USER_BY_ID = 'SELECT * FROM user WHERE employee_id = ?';
export const GET_ROLE_BY_ID = 'SELECT * FROM role WHERE role_id = ?';
export const INSERT_FOODITEM_QUERY = 'INSERT INTO fooditem (item_name, item_price, category_id) VALUES (?, ?, ?)';