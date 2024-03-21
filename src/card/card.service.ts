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

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    // User? Member Service Inject 해줘야 한다.
  ) {}

  // 마감일이 시작일 이전인지 또는 마감일이 오늘 이전인지 확인(지정된 경우).
  async create(createCardDto: CreateCardDto, userId: number, columnId: number) {
    if (
      createCardDto.startDate &&
      createCardDto.endDate &&
      (createCardDto.endDate < createCardDto.startDate ||
        createCardDto.endDate < new Date())
    ) {
      throw new BadRequestException(
        '마감일은 시작일 이후이거나 오늘 이후여야 합니다.',
      );
    }
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

  // updateCardOrder

  async updateCardOrder(columnId: number, cardId: number, rankId: string) {
    //
  }
}
