import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";
export class RecommendedMenuService {
  private recommendedMenuRepository: RecommendedMenuRepository;

  constructor() {
    this.recommendedMenuRepository = new RecommendedMenuRepository();
  }

  async checkRollOut() {
    try {
      return await this.recommendedMenuRepository.checkRollOut();
    } catch (error) {
      return "Error while checking recommended menu";
    }
  }

  async addItemInRecommendedMenu(item: any) {
    if (item?.message !== undefined)
      return { success: false, message: item.message };
    const { breakfast, lunch, dinner } = item;

    const breakfastValues = breakfast
      .map((itemId: number) => `(${itemId}, 1)`)
      .join(", ");
    const lunchValues = lunch
      .map((itemId: number) => `(${itemId}, 2)`)
      .join(", ");
    const dinnerValues = dinner
      .map((itemId: number) => `(${itemId}, 3)`)
      .join(", ");

    const values = [breakfastValues, lunchValues, dinnerValues].join(", ");

    
    try {
      return await this.recommendedMenuRepository.addItem(values);
    } catch (error) {
      console.error(
        "Error in service while adding item to recommended menu:",
        error
      );
      return {
        success: false,
        message: "Failed to add item to recommended menu.",
      };
    }
  }

  async viewRecommededItems(employeeId: number) {
    try {
      return await this.recommendedMenuRepository.viewRecommededItems(
        employeeId
      );
    } catch (error) {
      return "Failed to fetch recommended menu items.";
    }
  }

  async selectFromRollOut() {
    try {
      return await this.recommendedMenuRepository.selectFromRollOut();
    } catch (error) {
      return "Error while showing rolled out menu";
    }
  }
}
