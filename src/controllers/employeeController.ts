import { User } from "../models/user";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";
import { VoteRepository } from "../repositories/voteRepository";
import { FeedbackService } from "../services/feedbackService";
import { MenuItemService } from "../services/menuItemService";
import { NotificationService } from "../services/notificationService";
import { RecommendationService } from "../services/recommendationService";

export class EmployeeController {
  private menuItemService: MenuItemService;
  private feedbackService: FeedbackService;
  private recommededRepository: RecommendedMenuRepository;
  private voteRepository: VoteRepository;
  private notificationService: NotificationService;
  private recommendationService: RecommendationService;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.recommededRepository = new RecommendedMenuRepository();
    this.feedbackService = new FeedbackService();
    this.voteRepository = new VoteRepository();
    this.notificationService = new NotificationService();
    this.recommendationService= new RecommendationService();
  }

  viewRollOutMenu = async () => {
    const data = await this.recommededRepository.viewRecommededItems();
    return { data, type: "recommendedItem" };
  };

  viewMenu = async () => {
    const data = await this.menuItemService.viewMenu();
    return { data, type: "foodItem" };
  };

  viewFeedback = () => {
  };

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
        return "logout";
      case 6:
        return this.viewRollOutMenu();
      default:
        console.error("Invalid function index for admin");
    }
  }
}
