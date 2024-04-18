import { BadRequestException } from '@nestjs/common';

export function validateDate(value: any): number {
  console.log('value', value);
  const dateParts = value.split('/');

  if (dateParts.length !== 3 || dateParts[2].toString().length !== 2) {
    throw new BadRequestException(
      'Invalid date format. Please provide date in the format dd/mm/yy',
    );
  }
  const [day, month, year] = dateParts.map(Number);
  const providedDate = new Date(2000 + year, month - 1, day);

  const currentDate = new Date();
  console.log(currentDate, providedDate);

  if (providedDate < currentDate) {
    throw new BadRequestException('Please enter a valid future date');
  }
  console.log('date', dateParts);

  return parseInt(dateParts[0]);
}
