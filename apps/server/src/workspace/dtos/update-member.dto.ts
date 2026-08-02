import { $Enums } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateMemberDTO {
  @IsEnum($Enums.Role)
  role: $Enums.Role;
}
