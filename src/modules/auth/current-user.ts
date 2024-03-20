import { UserRoleEnum } from 'src/roles/roles.enum';

export class CurrentUser {
  id: string;
  username: string;
  roles: UserRoleEnum[];
}
