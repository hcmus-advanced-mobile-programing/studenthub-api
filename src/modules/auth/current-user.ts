import { UserRole } from 'src/common/common.enum';
import { Company } from 'src/modules/company/company.entity';
import { Student } from 'src/modules/student/student.entity';

export class CurrentUser {
  id: string | number;
  fullname: string;
  student?: Student;
  company?: Company;
  roles: UserRole[];
}
