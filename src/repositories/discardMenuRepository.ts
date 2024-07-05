import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db_connection";
import { GET_DISCARD_MENU_ITEMS } from "../queries/queries";

export class DiscardMenuRepsitory {
  async getDetailedFeedbackItem() {
    try {
        const query = `
        SELECT f.item_id as itemId, fi.item_name as name
        FROM feedbackdiscarditem f
        JOIN fooditem fi ON f.item_id = fi.item_id;
      `;
      const [rows] = await pool.query<RowDataPacket[]>(query);
      return rows;
    } catch (error) {
      console.log(
        "Error while getting the item for detailed feedback: ",
        error
      );
      return "Error in getting the item for detailed feedbac";
    }
  }

  async getDiscardMenuItem() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(GET_DISCARD_MENU_ITEMS);
      return rows;
    } catch (error) {
      console.log("Error while viewing the discard menu item :", error);
      return "Error in viewing the discard menu items";
    }
  }

  async checkEmployeeFeedbackAction(employeeID: number) {
    try {
      const checkQuery = `
            SELECT 1
            FROM userdiscardaction
            WHERE employee_id = ? AND action_type = 3
              AND YEAR(last_used) = YEAR(NOW()) AND MONTH(last_used) = MONTH(NOW())
            LIMIT 1;
        `;
      const [rows] = await pool.query<RowDataPacket[]>(checkQuery, [
        employeeID,
      ]);

      if (rows.length > 0) {
        return false;
      } else {
        const checkExistsQuery = `
                SELECT 1
                FROM userdiscardaction
                WHERE employee_id = ? AND action_type = 3
                LIMIT 1;
            `;
        const [existsRows] = await pool.query<RowDataPacket[]>(
          checkExistsQuery,
          [employeeID]
        );

        if (existsRows.length > 0) {
          const updateQuery = `
                    UPDATE userdiscardaction
                    SET last_used = NOW()
                    WHERE employee_id = ? ;
                `;
          await pool.query(updateQuery, [employeeID]);
        } else {
          const insertQuery = `
                    INSERT INTO userdiscardaction (employee_id, action_type, last_used)
                    VALUES (?, 3, NOW());
                `;
          await pool.query(insertQuery, [employeeID]);
        }
        return true;
      }
    } catch (error) {
      console.log(
        "Error while performing action in table discard action  ",
        error
      );
      return false;
    }
  }

  async checkRemoveAction(employeeID: number) {
    try {
      const checkQuery = `
        SELECT 1
        FROM userdiscardaction
        WHERE action_type = 1
          AND YEAR(last_used) = YEAR(NOW()) AND MONTH(last_used) = MONTH(NOW())
        LIMIT 1;
      `;
      const [rows] = await pool.query<RowDataPacket[]>(checkQuery, [
        employeeID,
      ]);

      if (rows.length > 0) {
        return false;
      } else {
        const updateQuery = `
          UPDATE userdiscardaction
          SET employee_id = ?, last_used = NOW()
          WHERE action_type = 1;
        `;
        const [updateResult] = await pool.query<ResultSetHeader>(updateQuery, [
          employeeID,
        ]);

        if (updateResult.affectedRows === 0) {
          const insertQuery = `
            INSERT INTO userdiscardaction (employee_id, action_type, last_used)
            VALUES (?, 1, NOW());
          `;
          await pool.query(insertQuery, [employeeID]);
        }

        return true;
      }
    } catch (error) {
      console.log(
        "Error while performing action in table discard action  ",
        error
      );
      return false;
    }
  }

  async checkFeedbackAction(employeeID: number) {
    try {
      const checkQuery = `
        SELECT 1
        FROM userdiscardaction
        WHERE action_type = 2
          AND YEAR(last_used) = YEAR(NOW()) AND MONTH(last_used) = MONTH(NOW())
        LIMIT 1;
      `;
      const [rows] = await pool.query<RowDataPacket[]>(checkQuery);

      if (rows.length > 0) {
        return false;
      } else {
        const updateQuery = `
          UPDATE userdiscardaction
          SET employee_id = ?, last_used = NOW()
          WHERE action_type = 2;
        `;
        const [updateResult] = await pool.query<ResultSetHeader>(updateQuery, [
          employeeID,
        ]);

        if (updateResult.affectedRows === 0) {
          const insertQuery = `
            INSERT INTO userdiscardaction (employee_id, action_type, last_used)
            VALUES (?, 2, NOW());
          `;
          await pool.query(insertQuery, [employeeID]);
        }

        return true;
      }
    } catch (error) {
      console.log(
        "Error while performing action in table discard action  ",
        error
      );
    }
  }

  async addItemInFeedbackDiscardItem(itemId: number) {
    try {
      const truncateQuery = `
      TRUNCATE TABLE feedbackdiscarditem;
    `;
      await pool.query(truncateQuery);

      const insertQuery = `
      INSERT INTO feedbackdiscarditem (item_id)
      VALUES (?);
    `;
      await pool.query(insertQuery, [itemId]);
      return true;
    } catch (error) {
      return false;
    }
  }
  async addDetailedFeedback(response:any,employeeId:number) {
    const { itemId, likeResponse, dislikeResponse, reciepeResponse } = response;
    try {
      const insertQuery = `
        INSERT INTO detailedfeedback (item_id, employee_id, \`like\`, dislike, moms_recipe)
        VALUES (?, ?, ?, ?, ?);
      `;
      await pool.query(insertQuery, [itemId, employeeId, likeResponse, dislikeResponse, reciepeResponse]);
      return true;
    } catch (error) {
      console.log("Error while inserting detailed feedback: ", error);
      return false;
    }
  }
}
