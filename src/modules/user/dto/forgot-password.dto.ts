import { IsEmail, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
