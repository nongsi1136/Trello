// auth.strategy.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../types/role.type';
import { Member } from '../entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class RoleStrategy {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}
  async validate(
    userId: number,
    boardId: number,
    requiredRole: Role[]
  ): Promise<boolean> {
    const member = await this.memberRepository.findOne({
      where: {
        userId,
        boardId,
      },
    });
    (member)
    if (!member) {
      throw new ForbiddenException('권한이 없습니다.');
    }
    const userRole: Role = member.role;
    return requiredRole.includes(userRole); // 1 === Admin_or_Super
  }
} // 초대가 되었는지 검증하고 + 권한이 뭔지 까지 검증하는
