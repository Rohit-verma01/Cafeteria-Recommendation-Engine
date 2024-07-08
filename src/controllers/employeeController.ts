import { User } from "../models/user";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";
import { VoteRepository } from "../repositories/voteRepository";
import { DiscardItemService } from "../services/discardItemService";
import { FeedbackService } from "../services/feedbackService";
import { MenuItemService } from "../services/menuItemService";
import { NotificationService } from "../services/notificationService";
import { UserService } from "../services/userService";

export class EmployeeController {
  private menuItemService: MenuItemService;
  private feedbackService: FeedbackService;
  private recommededRepository: RecommendedMenuRepository;
  private voteRepository: VoteRepository;
  private notificationService: NotificationService;
  private discardItemService: DiscardItemService;
  private userService: UserService;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.recommededRepository = new RecommendedMenuRepository();
    this.feedbackService = new FeedbackService();
    this.voteRepository = new VoteRepository();
    this.notificationService = new NotificationService();
    this.discardItemService = new DiscardItemService();
    this.userService = new UserService();
  }

  viewRollOutMenu = async (employeeId:number) => {
    const data = await this.recommededRepository.viewRecommededItems(employeeId);
    return { data, type: "recommendedItem" };
  };

  viewMenu = async () => {
    const data = await this.menuItemService.viewMenu();
    return { data, type: "foodItem" };
  };

  viewFeedback = () => {};

  giveFeedback = async (payload: any, user: any) => {
    try {
      const data = await this.feedbackService.sendFeedback(payload, user);
      return { data, type: "message" };
    } catch (error: any) {
      return { data: error.message, type: "error" };
    }
  };

  sendVotes = async (payload: any, user: any) => {
    if (payload) {
      const data = await this.voteRepository.addVotes(payload, user);
      return { data, type: "message" };
    }
  };

  viewNotification = async (user: any) => {
    const data = await this.notificationService.viewNotification(user);
    return { data, type: "notification" };
  };

  sendDetailedFeedback = async (payload: any, employeeId: number) => {
    if (payload)
      return await this.discardItemService.addDetailedFeedback(
        payload,
        employeeId
      );
    else return { data: "", type: "message" };
  };

  sendUpdatedProfileInfo = async (payload: any, employeeId: number) => {
    const data = await this.userService.updateProfileById(payload,employeeId);
    return { data, type: "message" };
  };

  async executeFunctionality(index: number, payload: any, user: any) {
    switch (index) {
      case 1:
        return this.viewMenu();
      case 2:
        return this.viewNotification(user);
      case 3:
        return this.giveFeedback(payload, user);
      case 4:
        return this.sendVotes(payload, user);
      case 5:
        return this.sendDetailedFeedback(payload, user.employee_id);
      case 6:
        return this.sendUpdatedProfileInfo(payload,user.employee_id);
      case 7:
        return "logout";
      case 8:
        return this.viewRollOutMenu(user);
      default:
        console.error("Invalid function index for admin");
    }
  }
}
