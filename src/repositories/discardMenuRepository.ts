import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db_connection";
import {
  CHECK_CURRENT_MONTH_ACTION,
  CHECK_CURRENT_MONTH_EMPLOYEE_ACTION,
  CHECK_EMPLOYEE_ACTION_EXISTS,
  GET_DISCARD_MENU_ITEMS,
  GET_FEEDBACK_DISCARD_ITEM,
  INSERT_INTO_DETAILED_FEEDBACK,
  INSERT_INTO_FEEDBACK_DISCARD_ITEM,
  INSERT_NEW_ACTION,
  TRUNCATE_FEEDBACK_DISCARD_ITEM,
  UPDATE_EMPLOYEE_LAST_USED_TIMESTAMP,
  UPDATE_LAST_USED_FOR_ACTION_TYPE,
} from "../queries/queries";

export class DiscardMenuRepsitory {
  async getDetailedFeedbackItem() {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        GET_FEEDBACK_DISCARD_ITEM
      );
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
      const [rows] = await pool.query<RowDataPacket[]>(
        CHECK_CURRENT_MONTH_EMPLOYEE_ACTION,
        [employeeID]
      );

      if (rows.length > 0) {
        return false;
      } else {
        const [existsRows] = await pool.query<RowDataPacket[]>(
          CHECK_EMPLOYEE_ACTION_EXISTS,
          [employeeID]
        );

        if (existsRows.length > 0) {
          await pool.query(UPDATE_EMPLOYEE_LAST_USED_TIMESTAMP, [employeeID]);
        } else {
          await pool.query(INSERT_NEW_ACTION, [employeeID, 3]);
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
      const [rows] = await pool.query<RowDataPacket[]>(
        CHECK_CURRENT_MONTH_ACTION,
        [1]
      );

      if (rows.length > 0) {
        return false;
      } else {
        const [updateResult] = await pool.query<ResultSetHeader>(
          UPDATE_LAST_USED_FOR_ACTION_TYPE,
          [employeeID, 1]
        );

        if (updateResult.affectedRows === 0) {
          await pool.query(INSERT_NEW_ACTION, [employeeID, 1]);
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
      const [rows] = await pool.query<RowDataPacket[]>(
        CHECK_CURRENT_MONTH_ACTION,
        [2]
      );
      if (rows.length > 0) {
        return false;
      } else {
        const [updateResult] = await pool.query<ResultSetHeader>(
          UPDATE_LAST_USED_FOR_ACTION_TYPE,
          [employeeID, 2]
        );

        if (updateResult.affectedRows === 0) {
          await pool.query(INSERT_NEW_ACTION, [employeeID, 2]);
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
      await pool.query(TRUNCATE_FEEDBACK_DISCARD_ITEM);
      await pool.query(INSERT_INTO_FEEDBACK_DISCARD_ITEM, [itemId]);
      return true;
    } catch (error) {
      return false;
    }
  }

  async addDetailedFeedback(response: any, employeeId: number) {
    const { itemId, likeResponse, dislikeResponse, reciepeResponse } = response;
    try {
      await pool.query(INSERT_INTO_DETAILED_FEEDBACK, [
        itemId,
        employeeId,
        likeResponse,
        dislikeResponse,
        reciepeResponse,
      ]);
      return true;
    } catch (error) {
      console.log("Error while inserting detailed feedback: ", error);
      return false;
    }
  }
}
