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

export const GET_ALL_RECOMMENDED_MENU_ITEMS = `SELECT 
  rm.item_id, 
  f.item_name, 
  mt.meal_type, 
  c.category_name,
  AVG(fd.rating) AS average_rating, 
  f.sentiments AS sentiments
FROM recommendedmenu rm 
JOIN fooditem f ON rm.item_id = f.item_id 
JOIN mealtype mt ON rm.meal_type_id = mt.meal_type_id 
JOIN category c ON f.category_id = c.category_id
JOIN employee e ON e.id = ? 
LEFT JOIN feedback fd ON f.item_id = fd.item_id 
GROUP BY rm.item_id, f.item_name, mt.meal_type, c.category_name, f.sentiments
ORDER BY 
  CASE WHEN f.diet_preference = e.diet_preference THEN 0 ELSE 1 END,
  CASE WHEN f.cuisine_preference = e.cuisine_preference THEN 0 ELSE 1 END,
  CASE WHEN f.spice_level = e.spice_level THEN 0 ELSE 1 END,
  CASE WHEN f.is_sweet = e.is_sweet_tooth THEN 0 ELSE 1 END;
`;

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

export const INSERT_NOTIFICATION = `INSERT INTO notification (message, role_id,type) VALUES (?,?,?)`;

export const GET_UNSEEN_NOTIFICATIONS = `
        SELECT n.notification_id, n.message
        FROM notification n
        LEFT JOIN usernotification un ON n.notification_id = un.notification_id AND un.employee_id = ?
        WHERE n.role_id = ?
          AND un.notification_id IS NULL
          AND (n.type != 'rollout_menu' OR (n.type = 'rollout_menu' AND n.date = CURRENT_DATE))
      `;

export const INSERT_INTO_USER_NOTIFICATION = `INSERT INTO usernotification (employee_id, notification_id) VALUES ?`;

export const CHECK_VOTE_TODAY = ` SELECT COUNT(*) AS count_votes FROM vote
        WHERE employee_id = ? AND date = CURRENT_DATE`;

export const CHECK_DISCARD_MENU = `
        SELECT 1
        FROM discard_menu
        WHERE MONTH(date) = MONTH(CURDATE())
        AND YEAR(date) = YEAR(CURDATE())
        LIMIT 1;
      `;

export const GET_DISCARD_MENU_ITEMS = `
  SELECT f.item_id AS itemId, f.item_name AS item, f.item_price AS price
  FROM fooditem f
  JOIN (
    SELECT item_id, AVG(rating) AS avg_rating
    FROM feedback
    GROUP BY item_id
  ) avg_ratings ON f.item_id = avg_ratings.item_id
  WHERE f.sentiment_score < 1.5
  AND avg_ratings.avg_rating < 2;
`;

export const GET_FEEDBACK_DISCARD_ITEM = `SELECT f.item_id as itemId, fi.item_name as name
  FROM feedbackdiscarditem f JOIN fooditem fi ON f.item_id = fi.item_id;
`;

export const CHECK_CURRENT_MONTH_EMPLOYEE_ACTION = `SELECT 1 FROM userdiscardaction
  WHERE employee_id = ? AND action_type = 3
  AND YEAR(last_used) = YEAR(NOW()) AND MONTH(last_used) = MONTH(NOW())
  LIMIT 1;
`;

export const CHECK_EMPLOYEE_ACTION_EXISTS = `SELECT 1 FROM userdiscardaction
WHERE employee_id = ? AND action_type = 3 LIMIT 1;
`;

export const UPDATE_EMPLOYEE_LAST_USED_TIMESTAMP = `UPDATE userdiscardaction
  SET last_used = NOW() WHERE employee_id = ? ;
`;

export const INSERT_NEW_ACTION = `INSERT INTO userdiscardaction (employee_id, action_type, last_used)
  VALUES (?, ?, NOW());
`;

export const CHECK_CURRENT_MONTH_ACTION = `SELECT 1 FROM userdiscardaction
  WHERE action_type = ? AND YEAR(last_used) = YEAR(NOW()) AND MONTH(last_used) = MONTH(NOW())
  LIMIT 1;
`;

export const UPDATE_LAST_USED_FOR_ACTION_TYPE = `UPDATE userdiscardaction
  SET employee_id = ?, last_used = NOW() WHERE action_type = ?;
`;

export const TRUNCATE_FEEDBACK_DISCARD_ITEM = `TRUNCATE TABLE feedbackdiscarditem;`;

export const INSERT_INTO_FEEDBACK_DISCARD_ITEM = `
  INSERT INTO feedbackdiscarditem (item_id) VALUES (?);
`;

export const INSERT_INTO_DETAILED_FEEDBACK = `
  INSERT INTO detailedfeedback (item_id, employee_id, \`like\`, dislike, moms_recipe)
  VALUES (?, ?, ?, ?, ?);
`;

export const GET_ITEM_BY_ID = `SELECT item_name FROM fooditem WHERE item_id = ?;`;

export const CHECK_EMPLOYEE_EXISTS =
  "SELECT COUNT(*) AS count FROM employee WHERE id = ?";

export const INSERT_EMPLOYEE_WITH_PREFERENCE = `
  INSERT INTO employee (id, diet_preference, spice_level, cuisine_preference, is_sweet_tooth)
  VALUES (?, ?, ?, ?, ?)
`;

export const UPDATE_EMPLOYEE_WITH_PREFERENCE = `UPDATE employee
  SET diet_preference = ?, spice_level = ?, cuisine_preference = ?, is_sweet_tooth = ?
  WHERE id = ?
`;
