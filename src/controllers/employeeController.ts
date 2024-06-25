import { User } from "../models/user";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";
import { VoteRepository } from "../repositories/voteRepository";
import { FeedbackService } from "../services/feedbackService";
import { MenuItemService } from "../services/menuItemService";

export class EmployeeController {
  private menuItemService: MenuItemService;
  private feedbackService: FeedbackService;
  private recommededRepository: RecommendedMenuRepository;
  private voteRepository: VoteRepository;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.recommededRepository = new RecommendedMenuRepository();
    this.feedbackService = new FeedbackService()
    this.voteRepository = new VoteRepository();
  }

  viewRollOutMenu = async() => {
    const data = await this.recommededRepository.viewRecommededItems();
    return {data,type:"recommendedItem"}
  };
  viewMenu = async () => {
    console.log("Employee is viewing the menu\n");
    const data = await this.menuItemService.viewMenu();
    return {data,type:"foodItem"}
  };

  viewFeedback = () => {
    console.log("Employee is viewing feedback\n");
  };

  giveFeedback = async (payload: any, user: any) => {
    console.log("Employee is giving feedback\n");
    try {
      const data = await this.feedbackService.sendFeedback(payload, user);
      return { data, type: "message" };
    } catch (error:any) {
      return { data: error.message, type: "error" };
    }
  };

  sendVotes = async(payload:any,user:any) => {
    if(payload){
      console.log("Employee is giving votes\n")
      const data = await this.voteRepository.addVotes(payload,user)
      return {data,type:"message"};
    }
  }

  async executeFunctionality(index: number, payload: any,user:any) {
    switch (index) {
      case 1:
        return this.viewMenu();
      case 2:
      // return this.updateMenuItem(payload);
      case 3:
        return this.giveFeedback(payload,user);
      case 4:
        return this.sendVotes(payload,user);
      case 5:
        return this.viewRollOutMenu();
      default:
        console.error("Invalid function index for admin");
    }
  }
}
