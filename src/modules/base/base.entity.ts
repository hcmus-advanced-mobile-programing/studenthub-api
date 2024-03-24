import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number | string;

  @CreateDateColumn({
    name: 'created_at',
  })
  @ApiProperty({ description: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  @ApiProperty({ description: 'updatedAt' })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
  })
  @ApiProperty({ description: 'deletedAt' })
  deletedAt: Date;
}
