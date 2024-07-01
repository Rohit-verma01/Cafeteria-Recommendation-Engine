import { Socket } from "socket.io-client";
import { promptForFeedback, promptForVote } from "../utils/prompts";
export const handleEmployeeInput = async (
    selectedIndex: number,
    socket: Socket,
    employeeId: number
  ) => {
    switch (selectedIndex) {
      case 1:
        return "";
      case 2:
        return "";
      case 3:
        return await giveFeedback(socket);
      case 4:
        return await voteForItems(socket, employeeId);
    }
  };

  export const giveFeedback = async (socket: Socket) => {
    await new Promise<void>((resolve) => {
      socket.emit("showMenu");
      socket.on("sendMenu", async (response) => {
        console.table(response.data, ["itemId", "item", "price", "category"]);
        resolve();
      });
    });
    return await promptForFeedback();
  };

  export const voteForItems = async (socket: Socket, employeeId: number) => {
    let menu = {},
      message = "";
    await new Promise<void>((resolve) => {
      socket.emit("isUserVoted", employeeId);
      socket.on("checkUserVoted", async (response) => {
        message = response;
        resolve();
      });
    });
    message && console.log(message);
    if (message == "") {
      await new Promise<void>((resolve) => {
        socket.emit("showRollOutMenu");
        socket.on("sendRecommendedMenu", async (response) => {
          menu = response.data;
          console.table(response.data);
          resolve();
        });
      });
      return await promptForVote(menu);
    }
  };