import { promptForDiscardMenu, promptForRollOut } from "../utils/prompts";
import { Socket } from "socket.io-client";
export const handleChefInput = async (
    selectedIndex: number,
    socket: Socket,
  ) => {
    switch (selectedIndex) {
      case 1:
        return await rollOutItems(socket);
      case 2:
        return "";
      case 3:
        return "";
      case 4:
        return "";
      case 5:
      return await discardMenu(socket);
      case 6:
        return "";
    }
  };

  export const rollOutItems = async (socket: Socket) => {
    await new Promise<void>(async(resolve) => {
      socket.emit("showMenu");
      socket.on("sendMenu", async (response) => {
        console.table(response, ["itemId", "item", "price", "category","totalScore"]);
        console.log(
          "Above are the system generated category wise sorted recommendation for you.\nYou can choose from above menu."
        );
        resolve();
      });
    });
    return await promptForRollOut();
  };

  export const discardMenu = async (socket: Socket) => {
    let list:any=[];
    await new Promise<void>(async(resolve) => {
      socket.emit("showDiscardMenu");
      socket.on("sendDiscardMenu", async (response) => {
        console.table(response.data, ["itemId", "item", "price"]);
        list=response.data;
        resolve();
      });
    });
    return await promptForDiscardMenu(list);
  };