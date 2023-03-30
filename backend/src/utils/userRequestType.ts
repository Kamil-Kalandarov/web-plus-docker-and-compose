import { Request } from '@nestjs/common';
import { User } from '../users/entities/users.entity';

export interface userRequestType extends Request {
  user: User;
}
