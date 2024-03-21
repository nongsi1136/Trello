import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  exports: [TypeOrmModule],
})
export class CommentModule {}
