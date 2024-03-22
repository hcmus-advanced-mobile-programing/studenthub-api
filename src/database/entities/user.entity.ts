import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document } from 'mongoose';
import { UserRoleEnum } from 'src/roles/roles.enum';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  @IsEmail()
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  roles: UserRoleEnum[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isConfirm: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
