import { MenuItemRepository } from "../repositories/menuItemRepository";
import { RecommendedMenuRepository } from "../repositories/recommendedMenuService";

export class MenuItemService {
    private menuItemRepository: MenuItemRepository;
    private recommendedItemRepository: RecommendedMenuRepository
  
    constructor() {
      this.menuItemRepository = new MenuItemRepository();
      this.recommendedItemRepository = new RecommendedMenuRepository();
    }
  
    async viewMenu() {
      return await this.menuItemRepository.getAllMenuItems();
    }
  
    async addItem(item: any) {
      return await this.menuItemRepository.addMenuItem(item);
    }
  
    async updateItem(item: any) {
      return await this.menuItemRepository.updateMenuItem(item);
    }
  
    async deleteItem(name: any) {
      // Implement deleteItem functionality
      return await this.menuItemRepository.deleteMenuItem(name);
    }

    async addItemInRecommendedMenu(item:any){
      
    }
  }