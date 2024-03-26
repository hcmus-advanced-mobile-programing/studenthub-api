export enum UserRole {
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
  COMPANY = 'COMPANY',
  STUDENT = 'STUDENT',
  USER = 'USER',
}

export enum CompanySize {
  JUST_ME = 'JUST_ME', //"It's just me",
  SMALL = 'SMALL', //'2-9 employees',
  MEDIUM = 'MEDIUM', //'10-99 employees',
  LARGE = 'LARGE', //'100-1000 employees',
  VERY_LARGE = 'VERY_LARGE', //'More than 100 employees',
}

export enum StatusFlag {
  Waitting = 0,
  Offer = 1,
  Hired = 2,
}

export enum DisableFlag {
  Enable = 0,
  Disable = 1,
}

export enum TypeFlag {
  Working = 0,
  Archieved = 1,
}
