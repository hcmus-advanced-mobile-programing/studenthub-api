import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { UserService } from 'src/modules/user/user.service';

@ValidatorConstraint({ name: 'isEmailAlreadyExist', async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private usersService: UserService) {}

    async validate(email: string, args: ValidationArguments) {
        const user = await this.usersService.findOne({ email: email });
        return !user;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Email already exists';
    }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistConstraint,
        });
    };
}
