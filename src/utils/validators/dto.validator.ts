import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export async function checkObjectMatchesDto(obj: any, dto: any): Promise<boolean> {
  try {
    const dtoInstance = plainToClass(dto, obj);

    const errors = await validate(dtoInstance);

    return errors.length === 0;
  } catch (error) {
    return false; // Return false in case of error
  }
}
