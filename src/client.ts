import { io, Socket } from "socket.io-client";
import { promptInput, promptFunctionSelection } from "./utils/prompts";
import { handleUserSelection, showAvailableFunctions } from "./utils/clientUtils";
import { IUser } from "./types";

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
    this.socket.on("message",this.onGettingMessage);
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

  private onGettingMessage = (message:string|any) => {
      // if(message.length>1){
        console.log(message)
      // }
  };

  private onAvailableFunctions = async ({
    functions,
    roleName,
    user
  }: {
    functions: string[];
    roleName: string;
    user:IUser
  }) => {
    showAvailableFunctions(functions);
    const index = await promptFunctionSelection(functions,roleName)
    if(index!=undefined){

      const payload = await handleUserSelection(roleName,index)
      this.socket.emit("executeFunction",{index,payload,roleName,user})
    }
   
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
