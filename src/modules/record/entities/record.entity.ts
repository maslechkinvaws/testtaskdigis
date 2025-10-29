import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Min, Max, IsOptional, IsInt } from 'class-validator';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @Min(1)
  @Max(255)
  @ApiProperty({ example: 'record title' })
  title: string;

  @Column()
  @IsInt()
  @ApiProperty({ example: 1 })
  value: number;

  @Column()
  @IsOptional()
  @ApiProperty({ example: 'record description' })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
