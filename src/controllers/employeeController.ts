import { User } from "../models/user";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";
import { VoteRepository } from "../repositories/voteRepository";
import { MenuItemService } from "../services/menuItemService";

export class EmployeeController {
  private menuItemService: MenuItemService;
  private recommededRepository: RecommendedMenuRepository;
  private voteRepository: VoteRepository;

  constructor() {
    this.menuItemService = new MenuItemService();
    this.recommededRepository = new RecommendedMenuRepository();
    this.voteRepository = new VoteRepository();
  }

  viewRollOutMenu = async() => {
    const data = await this.recommededRepository.viewRecommededItems();
    return {data,type:"recommendedItem"}
  };
  viewMenu = () => {
    console.log("Employee is viewing the menu");
    // Implement the actual functionality here
  };

  viewFeedback = () => {
    console.log("Employee is viewing feedback");
    // Implement the actual functionality here
  };

  giveFeedback = () => {
    console.log("Employee is giving feedback");
    // Implement the actual functionality here
  };

  sendVotes = async(payload:any,user:any) => {
    if(payload)
      await this.voteRepository.addVotes(payload,user)
  }

  async executeFunctionality(index: number, payload: any,user:any) {
    switch (index) {
      case 1:
      // return this.rollOutItems(payload);
      case 2:
      // return this.updateMenuItem(payload);
      case 3:
        return this.viewMenu();
      case 4:
        return this.sendVotes(payload,user);
      case 5:
        return this.viewRollOutMenu();
      default:
        console.error("Invalid function index for admin");
    }
  }
}
