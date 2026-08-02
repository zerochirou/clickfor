import { IsString } from 'class-validator';

export class JoinCodeDTO {
  @IsString()
  code: string;
}
