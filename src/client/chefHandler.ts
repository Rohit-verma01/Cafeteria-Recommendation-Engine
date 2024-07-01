import { promptForRollOut } from "../utils/prompts";
import { Socket } from "socket.io-client";
export const handleChefInput = async (
    selectedIndex: number,
    socket: Socket,
    functions: any
  ) => {
    switch (selectedIndex) {
      case 1:
        return await rollOutItems(socket, functions);
      case 2:
        return "";
      case 3:
        return "";
      case 4:
        return "";
    }
  };

  export const rollOutItems = async (socket: Socket, functions: any) => {
    await new Promise<void>(async(resolve) => {
      socket.emit("showMenu");
      socket.on("sendMenu", async (response) => {
        console.table(response.data, ["itemId", "item", "price", "category","totalScore"]);
        console.log(
          "Above are the system generated category wise sorted recommendation for you.\nYou can choose from above menu."
        );
        resolve();
      });
    });
    return await promptForRollOut(functions);
  };