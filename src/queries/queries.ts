export const GET_USER_BY_ID = "SELECT * FROM user WHERE employee_id = ?";
export const GET_ROLE_BY_ID = "SELECT * FROM role WHERE role_id = ?";

export const INSERT_FOODITEM =
  "INSERT INTO fooditem (item_name, item_price, category_id) VALUES (?, ?, ?)";
export const UPDATE_PRICE =
  "UPDATE fooditem SET item_price = ? WHERE item_name = ?";
export const UPDATE_AVAILABILITY =
  "UPDATE fooditem SET is_available = ? WHERE item_name = ?";
export const UPDATE_PRICE_AND_AVAILABILITY =
  "UPDATE fooditem SET item_price = ?, is_available = ? WHERE item_name = ?";

export const GET_ALL_MENU_ITEMS = `SELECT f.item_id AS itemId, f.item_name AS item, f.item_price AS price, c.category_name AS category 
  FROM fooditem f 
  JOIN category c ON f.category_id = c.category_id 
  WHERE f.is_available = 1
  ORDER BY c.category_name;`;

export const GET_ALL_RECOMMENDED_MENU_ITEMS = `SELECT rm.item_id, f.item_name, mt.meal_type, mt.meal_type_id, f.category_id, c.category_name 
   FROM recommendedmenu rm 
   JOIN fooditem f ON rm.item_id = f.item_id 
   JOIN mealtype mt ON rm.meal_type_id = mt.meal_type_id 
   JOIN category c ON f.category_id = c.category_id;`;

export const INSERT_FEEDBACK = `INSERT INTO feedback (item_id, employee_id, comment, rating, date) 
   VALUES (?, ?, ?, ?, NOW());`;

export const INSERT_VOTES = `INSERT INTO vote (item_id, employee_id) 
   VALUES ?;`;

export const VOTE_COUNT = `CREATE TEMPORARY TABLE votecount AS 
   SELECT v.item_id, COUNT(v.item_id) AS vote_count 
   FROM vote v 
   WHERE v.date = CURRENT_DATE 
   GROUP BY v.item_id;`;

export const TOP_VOTE = `CREATE TEMPORARY TABLE topvote AS 
   SELECT rm.meal_type_id, vc.item_id, vc.vote_count 
   FROM votecount vc 
   JOIN recommendedmenu rm ON vc.item_id = rm.item_id;`;

export const DROP_VOTE_COUNT = `DROP TEMPORARY TABLE IF EXISTS votecount;`;

export const DROP_TOP_VOTE = `DROP TEMPORARY TABLE IF EXISTS topvote;`;

export const INSERT_FINAL_MENU = `INSERT INTO finalmenu (item_id) 
   SELECT item_id 
   FROM (
     SELECT item_id, meal_type_id, vote_count, 
            ROW_NUMBER() OVER (PARTITION BY meal_type_id ORDER BY vote_count DESC) AS rn 
     FROM topvote
   ) t 
   WHERE t.rn = 1;`;
