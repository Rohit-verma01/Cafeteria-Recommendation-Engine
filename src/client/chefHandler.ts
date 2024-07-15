import { promptForDiscardMenu, promptForRollOut, promptSendFinal } from "../utils/prompts";
import { Socket } from "socket.io-client";
export const handleChefInput = async (
    selectedIndex: number,
    socket: Socket,
    employeeId:number
  ) => {
    switch (selectedIndex) {
      case 1:
        return await rollOutItems(socket);
      case 2:
        return await selectFinalMenu(socket);
      case 3:
        return "";
      case 4:
        return "";
      case 5:
      return await discardMenu(socket,employeeId);
      case 6:
        return "";
    }
  };

  export const rollOutItems = async (socket: Socket) => {
    let isRollOut=false;
    await new Promise<void>(async(resolve) => {
      socket.emit("checkRollOut");
      socket.on("checkRollOut", async (response) => {
        isRollOut=response;
        resolve();
      });
    });
    if(isRollOut) return {message:"Already rolled out"};
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

  export const discardMenu = async (socket: Socket,employeeId:number) => {
    let list:any=[];
    await new Promise<void>(async(resolve) => {
      socket.emit("showDiscardMenu",employeeId);
      socket.on("sendDiscardMenu", async (response) => {
        console.table(response.data, ["itemId", "item", "price"]);
        list=response.data;
        resolve();
      });
    });
    return await promptForDiscardMenu(list);
  };

  export const selectFinalMenu = async (socket: Socket) => {
    let isRollOut=false,isMenuFinalize=false;
    await new Promise<void>(async(resolve) => {
      socket.emit("checkRollOut");
      socket.on("checkRollOut", async (response) => {
        isRollOut=response;
        resolve();
      });
    });
    if(!isRollOut) return {proceed:false,message:"Need to rolled out items first"}

    await new Promise<void>(async(resolve) => {
      socket.emit("checkMenuFinalize");
      socket.on("checkMenuFinalize", async (response) => {
        isMenuFinalize=response;
        resolve();
      });
    });
    if(isMenuFinalize) return {proceed:false,message:"Menu is already finalized"};

    let list:any=[]
    await new Promise<void>(async(resolve) => {
      socket.emit("selectFromRollOut");
      socket.on("selectFromRollOut", async (response) => {
        console.table(response);
        list=response;
        resolve();
      });
    });
    return await promptSendFinal(list)
  };