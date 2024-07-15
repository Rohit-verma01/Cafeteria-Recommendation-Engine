import { VoteRepository } from "../repositories/voteRepository";
export class VoteService {
  private voteRepository: VoteRepository;

  constructor() {
    this.voteRepository = new VoteRepository();
  }

  async countUserVote(employeeId: number) {
    try {
      return await this.voteRepository.countUserVote(employeeId);
    } catch (error) {
      return "Failed to count the votes.\n";
    }
  }

  async addVotes(voteList: any, user: any) {
    try {
      const list = voteList.map((item_id: number) => [
        item_id,
        user.employee_id,
      ]);
      return await this.voteRepository.addVotes(list);
    } catch (error) {
      return "Failed to add votes.\n";
    }
  }
}
