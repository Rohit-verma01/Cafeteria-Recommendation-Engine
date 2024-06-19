import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { UserController } from "./controllers/userController";
import { IFoodItem } from "./types";
import { getFunctionsByRole } from "./utils/serverUtils";

class Server {
  private httpServer: HTTPServer;
  private io: SocketIOServer;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.httpServer = createServer();
    this.io = new SocketIOServer(this.httpServer);
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log("a user connected");

      socket.on("authenticateUser", this.handleAuthenticateUser(socket));
      socket.on("disconnect", this.handleDisconnect);
      socket.on("addItem", this.handleAddingItem);
    });
  }

  private handleAuthenticateUser = (socket: Socket) => async (id: number) => {
    const userController = new UserController();
    const user = await userController.fetchUser(id);
    console.log(user);

    if (user) {
      const role = await userController.fetchRole(user.role_id);
      socket.emit("userFound", "Login Successfully");
      socket.emit(
        "userFound",
        `Welocme ${user.firstname} ${user.lastname} to the Cafeteria Recommendation System`
      );
      
      const functions: string[] | null = getFunctionsByRole(role!.role_name);
      socket.emit("availableFunctions", {
        functions,
        roleName: role!.role_name,
        user,
      });
    } else {
      socket.emit("userNotFound", "User not found");
    }
  };

  private handleDisconnect = () => {
    console.log("user disconnected");
  };

  private handleAddingItem = async (foodItemDetails: IFoodItem) => {
    console.log("Food Item ; ", foodItemDetails);
  };

  public start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

// Instantiate and start the server
const port = 8080;
const server = new Server(port);
server.start();
