import { DiscardMenuRepsitory } from "../repositories/discardMenuRepository";
import { MenuItemRepository } from "../repositories/menuItemRepository";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuRepository";

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;
  private recommendedItemRepository: RecommendedMenuRepository;
  private discardMenuRepository: DiscardMenuRepsitory;

  constructor() {
    this.menuItemRepository = new MenuItemRepository();
    this.recommendedItemRepository = new RecommendedMenuRepository();
    this.discardMenuRepository = new DiscardMenuRepsitory();
  }

  async viewMenu() {
    try {
      return await this.menuItemRepository.getAllMenuItems();
    } catch (error) {
      console.error("Error in service while fetching menu items:", error);
      return "Failed to fetch menu items.";
    }
  }

  async addItem(item: any) {
    try {
      return  await this.menuItemRepository.addMenuItem(item);
    } catch (error) {
      console.error("Error in service while adding menu item:", error);
      return {success:false,message:"Failed to add menu item."};
    }
  }

  async updateItem(item: any) {
    try {
      return await this.menuItemRepository.updateMenuItem(item);
    } catch (error) {
      console.error("Error in service while updating menu item:", error);
      return {success:false,message:"Failed to update menu item."};
    }
  }

  async deleteItem(name: any) {
    try {
      return await this.menuItemRepository.deleteMenuItem(name);
    } catch (error) {
      console.error("Error in service while deleting menu item:", error);
      return {success:false,message:`Failed to delete menu item "${name}".`};
    }
  }

  async getItemName(itemId: number) {
    try {
      return await this.menuItemRepository.getItemName(itemId);
    } catch (error) {
      console.error("Error in service while getting menu item name:", error);
      return {success:false,message:`Failed to get menu item name.`};
    }
  }

  async addItemInRecommendedMenu(item: any) {
    if(item?.message!==undefined)
      return {success:false,message:item.message} 
    try {
      return await this.recommendedItemRepository.addItem(item);
    } catch (error) {
      console.error(
        "Error in service while adding item to recommended menu:",
        error
      );
      return {success:false,message:"Failed to add item to recommended menu."};
    }
  }

  async addItemInFinalMenu(payload:any){
    if(!payload.proceed)
      return payload.message;
    try {
      return await this.menuItemRepository.finalizeTheMenu(payload.message);
    } catch (error) {
      console.error("Error in service while finalizing the menu:", error);
      return `Failed to finalize the menu.`;
    }
  }

  async addItemSentiments(score:number,sentiment:string,foodItem:any){
    try {
      return await this.menuItemRepository.addSentiments(score,sentiment,foodItem.itemId);
    } catch (error) {
      console.error("Error in adding sentiment Score:", error);
      return `Failed to add score.`;
    }
  }

  async viewRecommendationMenu(){
    try {
      return await this.menuItemRepository.getMenuWithRecommendation();
    } catch (error) {
      console.error("Error in getting Recommendation", error);
      return `Failed to view recommendation.`;
    }
  }

  async checkMenuFinalize(){
    try {
      return await this.menuItemRepository.checkFinalMenu();
    } catch (error) {
      return "Error while checking the final menu"
    }
  }

  async checkRollOut(){
    try {
      return await this.recommendedItemRepository.checkRollOut()
    } catch (error) {
      return "Error while checking the rolled out menu";
    }
  }

  async selectFromRollOut(){
    try{
      return await this.recommendedItemRepository.selectFromRollOut();
    } catch(error){
      return "Error while showing rolled out menu";
    }

  }
}
