import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'id' })
  id: number | string;

  @CreateDateColumn({
    name: 'created_at',
  })
  @ApiProperty({ description: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
  })
  @ApiProperty({ description: 'updatedAt', nullable: true })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    nullable: true,
  })
  @ApiProperty({ description: 'deletedAt', nullable: true })
  deletedAt: Date;
}
