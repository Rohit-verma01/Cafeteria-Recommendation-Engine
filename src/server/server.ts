import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { UserController } from "../controllers/userController";
import { getFunctionsByRole } from "./serverUtils";
import { AdminController } from "../controllers/adminController";
import { ChefController } from "../controllers/chefController";
import { EmployeeController } from "../controllers/employeeController";
import { DiscardItemService } from "../services/discardItemService";
import { MenuItemService } from "../services/menuItemService";
import { VoteService } from "../services/voteService";
import { RecommendedMenuService } from "../services/recommendedMenuService";

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
      socket.on("showRollOutMenu", this.sendRollOutMenu(socket));
      socket.on("isUserVoted", this.checkUserVoted(socket));
      socket.on("showDiscardMenu", this.sendDiscardMenu(socket));
      socket.on("checkMenuFinalize", this.checkMenuFinalize(socket));
      socket.on("checkRollOut", this.checkRollOut(socket));
      socket.on("selectFromRollOut", this.selectFromRollOut(socket));
      socket.on("showQuestionForFeedback", this.sendFeedbackQuestion(socket));
      socket.on("showActualMenu", this.showMenu(socket));
    });
  }

  private handleAuthenticateUser = (socket: Socket) => async (id: number) => {
    const userController = new UserController();
    const user: any = await userController.fetchUser(id);

    if (user) {
      const role: any = await userController.fetchRole(user.role_id);
      if (role) {
        socket.emit(
          "userFound",
          `Welocme ${user.firstname} ${user.lastname} to the Cafeteria Recommendation System`
        );
        this.sendAvailableFunctions(socket, role!.role_name, user);
      } else {
        socket.emit("message", "Role not found");
      }
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
    const menuItemService = new MenuItemService();
    const result = await menuItemService.viewRecommendationMenu();
    socket.emit("sendMenu", result);
  };

  private showMenu = (socket: Socket) => async () => {
    const menuItemService = new MenuItemService();
    const result = await menuItemService.viewMenu();
    socket.emit("showActualMenu", result);
  };

  private checkMenuFinalize = (socket:Socket) => async () => {
    const menuItemService = new MenuItemService();
    const result = await menuItemService.checkMenuFinalize()
    socket.emit("checkMenuFinalize",result);
  }

  private checkRollOut = (socket:Socket) => async()=>{
    const recommendedMenuService = new RecommendedMenuService();
    const result = await recommendedMenuService.checkRollOut()
    socket.emit("checkRollOut",result)
  }

  private selectFromRollOut = (socket:Socket)=> async()=>{
    const recommendedMenuService = new RecommendedMenuService();
    const result = await recommendedMenuService.selectFromRollOut()
    socket.emit("selectFromRollOut",result)
  }
  private sendFeedbackQuestion =
    (socket: Socket) => async (employeeId: number) => {
      const discardItemService = new DiscardItemService();
      const result = await discardItemService.getDetailedFeedbackItem(
        employeeId
      );
      socket.emit("sendFeedbackQuestion", result);
    };

  private sendDiscardMenu = (socket: Socket) => async (employeeId: number) => {
    const chefController = new ChefController();
    const result = await chefController.executeFunctionality(5, "", employeeId);
    socket.emit("sendDiscardMenu", result);
  };

  private checkUserVoted = (socket: Socket) => async (employeeId: number) => {
    const voteService = new VoteService();
    const result = await voteService.countUserVote(employeeId);
    socket.emit("checkUserVoted", result);
  };

  private sendRollOutMenu = (socket: Socket) => async (employeeId: number) => {
    const employeeController = new EmployeeController();
    const result = await employeeController.executeFunctionality(
      8,
      "",
      employeeId
    );
    socket.emit("sendRecommendedMenu", result);
  };

  private executeFunction =
    (socket: Socket) =>
    async ({ index, payload, roleName, user }: any) => {
      let result: any = "";
      switch (roleName) {
        case "admin":
          const adminController = new AdminController();
          result = await adminController.executeFunctionality(
            index,
            payload,
            user.employee_id
          );
          if (result === "logout") {
            console.log(`User with ID ${user.employee_id} logging out`);
            socket.emit("loggedOut");
          } else socket.emit("message", result);
          break;

        case "chef":
          const chefController = new ChefController();
          result = await chefController.executeFunctionality(
            index,
            payload,
            user
          );
          if (result === "logout") {
            console.log(`User with ID ${user.employee_id} logging out`);
            socket.emit("loggedOut");
          } else socket.emit("message", result);
          break;

        case "employee":
          const employeeController = new EmployeeController();
          result = await employeeController.executeFunctionality(
            index,
            payload,
            user
          );
          if (result === "logout") {
            console.log(`User with ID ${user.employee_id} logging out`);
            socket.emit("loggedOut");
          } else socket.emit("message", result);
          break;
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
