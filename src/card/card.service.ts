import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly usersService: UserService,
  ) {}

  async create(createCardDto: CreateCardDto, userId: number, columnId: number) {
    const findCards = await this.cardRepository.find({
      where: {
        column: {
          id: columnId,
        },
      },
    });

    // LexoRank 관련 코드

    // 생성 카드 정의
    const card = this.cardRepository.create({
      column: {
        id: columnId,
      },
      title: createCardDto.title,
      content: createCardDto.content,
      category: createCardDto.category,
      color: createCardDto.color,
      startDate: createCardDto.startDate,
      endDate: createCardDto.endDate,
    });

    // 정의된 카드 repository에 저장
    await this.cardRepository.save(card);

    return { card, message: '카드 생성 완료' };
  }

  async findAll(columnId: number) {
    const foundCard = await this.cardRepository.find({
      select: ['id', 'title'],
      where: {
        column: {
          id: columnId,
        },
      },
    });

    return { foundCard, message: '카드 목록 조회 성공' };
  }

  async findOne(id: number) {
    const card = await this.cardRepository.findOneBy({ id });

    if (!card) {
      throw new NotFoundException('해당 Card는 존재하지 않습니다.');
    }

    return { card, message: '카드 조회 완료' };
  }

  async remove(id: number) {
    const result = await this.cardRepository.delete(id);
    return { result, message: 'Card 삭제 완료' };
  }

  async update(id: number, updateCardDto: UpdateCardDto) {
    // card service
    const card = await this.availableCardById(id);
    this.cardRepository.merge(card, updateCardDto);
    const updatedCard = this.cardRepository.save(card);
    return { updatedCard, message: '카드가 정상적으로 수정되었습니다.' };
  }

  private async availableCardById(id: number) {
    const card = await this.cardRepository.findOne({
      where: {
        id,
      },
    });

    // relations

    if (!card) {
      throw new NotFoundException('해당 카드는 존재하지 않습니다.');
    }

    return card;
  }

  private async availableUserById(userId: number) {
    const user = await this.usersService.getUser(userId);
  }

  // addMemberToCard

  async addMemberToCard(cardId: number, userId: number) {
    const card = await this.availableCardById(cardId);
    const user = await this.availableUserById(userId);

    // card.workers = [...card.workers, user];

    await this.cardRepository.save(card);

    return { newMember: user, message: '작업자 추가' };
  }

  // updateCardOrder

  async updateCardOrder(columnId: number, cardId: number, rankId: string) {
    const findAllCard = await this.cardRepository.find({
      where: {
        column: {
          id: columnId,
        },
      },
      order: {
        order: 'ASC',
      },
    });
  }
}
