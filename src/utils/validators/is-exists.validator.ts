// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
// import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
// import { Model } from 'mongoose';
// @Injectable()
// @ValidatorConstraint({ name: 'IsExist', async: true })
// export class IsExist implements ValidatorConstraintInterface {
//   constructor() {}

//   async validate(value: string, validationArguments: ValidationArguments) {
//     const repository = validationArguments.constraints[0];
//     const pathToProperty = validationArguments.constraints[1];
//     const entity: unknown = await Model(repository).findOne({
//       where: {
//         [pathToProperty ? pathToProperty : validationArguments.property]: pathToProperty
//           ? value?.[pathToProperty]
//           : value,
//       },
//     });

//     return Boolean(entity);
//   }
// }
