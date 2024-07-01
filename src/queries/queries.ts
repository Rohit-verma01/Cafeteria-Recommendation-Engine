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
export const DELETE_FOOD_ITEM_BY_NAME =
  "DELETE FROM fooditem WHERE item_name = ?";
export const UPDATE_FOOD_ITEM_SENTIMENTS_BY_ID = `UPDATE fooditem SET sentiment_score = ?, sentiments = ? WHERE item_id = ?`;

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

export const GET_FEEDBACK_BY_FOOD_ID = `SELECT comment FROM feedback WHERE item_id = ?`;

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

export const GET_RECOMMENDATIONS = `
      SELECT 
        f.item_id AS itemId, 
        f.item_name AS item, 
        f.item_price AS price, 
        c.category_name AS category,
        AVG(IFNULL(fb.rating, 0)) AS averageRating,
        f.sentiment_score AS sentimentScore,
        (AVG(IFNULL(fb.rating, 0)) + f.sentiment_score) AS totalScore
      FROM 
        fooditem f 
      JOIN 
        category c ON f.category_id = c.category_id 
      LEFT JOIN 
        feedback fb ON f.item_id = fb.item_id
      WHERE 
        f.is_available = 1
      GROUP BY 
        f.item_id, f.item_name, f.item_price, 
        c.category_name,f.sentiment_score
      ORDER BY 
        c.category_name, totalScore DESC; `;

export const INSERT_NOTIFICATION=`INSERT INTO notification (message, role_id,type) VALUES (?,?,?)`;

export const GET_UNSEEN_NOTIFICATIONS=`
        SELECT n.notification_id, n.message
        FROM notification n
        LEFT JOIN usernotification un ON n.notification_id = un.notification_id AND un.employee_id = ?
        WHERE n.role_id = ?
          AND un.notification_id IS NULL
          AND (n.type != 'rollout_menu' OR (n.type = 'rollout_menu' AND n.date = CURRENT_DATE))
      `
export const INSERT_INTO_USER_NOTIFICATION= `INSERT INTO usernotification (employee_id, notification_id) VALUES ?`;
export const CHECK_VOTE_TODAY = ` SELECT COUNT(*) AS count_votes FROM vote
        WHERE employee_id = ? AND date = CURRENT_DATE`;