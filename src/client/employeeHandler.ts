import { Socket } from "socket.io-client";
import {
  promptForDeatiledFeedback,
  promptForFeedback,
  promptForUpdateProfile,
  promptForVote,
} from "../utils/prompts";
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
    case 5:
      return await giveDetailedFeedback(socket, employeeId);
    case 6:
      return await promptForUpdateProfile();
    case 7:
      return "";
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
      socket.emit("showRollOutMenu",employeeId);
      socket.on("sendRecommendedMenu", async (response) => {
        menu = response.data;
        console.table(response.data);
        resolve();
      });
    });
    return await promptForVote(menu);
  }
};

export const giveDetailedFeedback = async (
  socket: Socket,
  employeeId: number
) => {
  let result: any = "";
  await new Promise<void>((resolve) => {
    socket.emit("showQuestionForFeedback", employeeId);
    socket.on("sendFeedbackQuestion", async (response) => {
      result = response;
      resolve();
    });
  });
  if (result.data.length===0) {
    console.log("No item is discarded for detailed feedback yet.");
    return "";
  }
  if (result.success && result.data.length) {
    return await promptForDeatiledFeedback(result.data[0]);
  }
  console.log("Already did it in a month. Try again in next month")
  return "";
};

