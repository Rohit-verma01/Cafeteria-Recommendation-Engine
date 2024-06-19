import { io, Socket } from "socket.io-client";
import { promptInput, promptFunctionSelection } from "./utils/prompts";
import { showAvailableFunctions } from "./utils/clientUtils";

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
    this.socket.on("disconnect",this.onServerDisconnect);
  }

  private onConnect = () => {
    console.log("Connected to the server");
    promptInput("Enter your employee ID: ").then((id) => {
      this.socket.emit("authenticateUser", parseInt(id));
    });
  };

  private onUserFound = (message: string) => {
    console.log(message);
  };

  private onAvailableFunctions = async ({
    functions,
    roleName,
  }: {
    functions: string[];
    roleName: string;
  }) => {
    showAvailableFunctions(functions);
    promptFunctionSelection(this.socket,functions,roleName)
    // const item = await promptFunctionSelection(this.socket,functions,roleName)

    // this.socket.emit("addItem",item)
   
  };

  private onError = (error: string) => {
    console.error("Error:", error);
  };

  private onUserNotFound = (message: string) => {
    console.error(message);
  };

  private onServerDisconnect = ()=>{
    console.log("Server Stopped")
  }
}

// Instantiate the Client
new Client();
