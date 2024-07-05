import { io, Socket } from "socket.io-client";
import { promptInput, promptFunctionSelection } from "../utils/prompts";
import { handleUserSelection, showAvailableFunctions } from "./usersHandler";
import { IUser } from "../types";

class Client {
  private socket: Socket;

  constructor() {
    this.socket = io("http://localhost:8080");
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on("connect", this.onConnect);
    this.socket.on("userFound", this.onUserFound);
    this.socket.on("availableFunctions", this.onAvailableFunctions);
    this.socket.on("error", this.onError);
    this.socket.on("userNotFound", this.onUserNotFound);
    this.socket.on("disconnect", this.onServerDisconnect);
    this.socket.on("message", this.displayMessage);
    this.socket.on("Send Menu", this.showMenu);
    this.socket.on("loggedOut", this.loggedOut);
  }

  private onConnect = () => {
    console.log("Connected to the server");
    promptInput("Enter your employee ID: ").then((id) => {
      this.socket.emit("authenticateUser", parseInt(id));
    });
  };

  private showMenu = (data: any) => {
    console.log(data);
  };

  private onUserFound = (message: string) => {
    console.log(message);
  };

  private loggedOut = () => {
    console.log("You have been logged out");
    this.socket.disconnect();
    console.log("For login, again start the application");
  };

  private displayMessage = (response: any) => {
    if (response) {
      const { data, type } = response;
      if (type === "foodItem")
        console.table(data, ["itemId", "item", "price", "category"]);
      else if (type === "notification")
        if (data.length > 0)
          data.forEach((notification: string) => console.log(notification));
        else console.log("There is no new notification for you");
      else console.log(data);
    }
    console.log("\n");
  };

  private onAvailableFunctions = async ({
    functions,
    roleName,
    user,
  }: {
    functions: string[];
    roleName: string;
    user: IUser;
  }) => {
    showAvailableFunctions(functions);
    let index = await promptFunctionSelection(functions, roleName);

    if (index != undefined) {
      let payload = await handleUserSelection(
        roleName,
        index,
        this.socket,
        functions,
        user.employee_id
      );
      if(payload.index) index=payload.index;
      if(payload.data) payload=payload.data
      this.socket.emit("executeFunction", { index, payload, roleName, user });
    }
  };

  private onError = (error: string) => {
    console.error("Error:", error);
  };

  private onUserNotFound = (message: string) => {
    console.error(message);
  };

  private onServerDisconnect = () => {
    console.log("Disconnected from the server");
  };
}

new Client();
