import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Color } from '../types/color.type';
import { Visibility } from '../types/visibility.type';
import { Columns } from 'src/column/entities/column.entity';
import { array } from 'joi';

@Entity({ name: 'boards' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ type: 'varchar', length: 30, nullable: false })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsString()
  @Column({ type: 'varchar', nullable: false })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  content: string;

  @IsEnum(Color)
  @Column({ type: 'enum', enum: Color, default: Color.black })
  color: Color;

  @IsEnum(Visibility, { message: "유효하지 않은 공개범위입니다." })
  @Column({ type: 'enum', enum: Visibility, nullable: false })
  @IsNotEmpty({ message: "공개 범위를 선택해주세요." })
  visibility: Visibility;

  @Column({ type: 'json', nullable: false })
  member : JSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @OneToMany(() => Columns, (column) => column.board)
  columns: Columns[];
}