import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { UserController } from "./controllers/userController";
import { getFunctionsByRole } from "./utils/serverUtils";
import { AdminController } from "./controllers/adminController";
import { ChefController } from "./controllers/chefController";

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
      socket.on("showMenu", this.sendMenu(socket));
      socket.on("authenticateUser", this.handleAuthenticateUser(socket));
      socket.on("disconnect", this.handleDisconnect);
      socket.on("executeFunction", this.executeFunction(socket));
    });
  }

  private handleAuthenticateUser = (socket: Socket) => async (id: number) => {
    const userController = new UserController();
    const user = await userController.fetchUser(id);

    if (user) {
      const role = await userController.fetchRole(user.role_id);
      socket.emit("userFound", "Login Successfully");
      socket.emit(
        "userFound",
        `Welocme ${user.firstname} ${user.lastname} to the Cafeteria Recommendation System`
      );
      this.sendAvailableFunctions(socket, role!.role_name, user);
    } else {
      socket.emit("userNotFound", "User not found");
    }
  };

  private sendAvailableFunctions = (
    socket: Socket,
    roleName: string,
    user: any
  ) => {
    const functions: string[] | null = getFunctionsByRole(roleName);
    socket.emit("availableFunctions", {
      functions,
      roleName,
      user,
    });
  };

  private handleDisconnect = () => {
    console.log("user disconnected");
  };

  private sendMenu = (socket: Socket) => async () => {
    const adminController = new AdminController();
    const result = await adminController.executeFunctionality(4, "");
    socket.emit("sendMenu", result);
  };

  private executeFunction =
    (socket: Socket) =>
    async ({ index, payload, roleName, user }: any) => {
      let result: any = "";
      switch (roleName) {
        case "admin":
          const adminController = new AdminController();
          result = await adminController.executeFunctionality(index, payload);
          console.log("result = ", result);

          socket.emit("message", result);

        case "chef":
          const chefController = new ChefController();
          result = await chefController.executeFunctionality(index, payload);
          socket.emit("message", result);
        case "employee":
      }
      this.sendAvailableFunctions(socket, roleName, user);
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
