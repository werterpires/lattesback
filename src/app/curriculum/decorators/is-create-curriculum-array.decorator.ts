import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsArrayOfICurriculum(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsArrayOfICurriculum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) {
            return false;
          }
          for (const obj of value) {
            if (
              !(
                typeof obj.lattesId === 'string' &&
                typeof obj.active === 'boolean' &&
                typeof obj.serviceYears === 'string' &&
                typeof obj.curriculum === 'string' &&
                typeof obj.updatedDate === 'string'
              )
            ) {
              return false;
            }
          }
          return true;
        },
      },
    });
  };
}
