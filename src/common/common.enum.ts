export enum UserRole {
  STUDENT = 0,
  COMPANY = 1,
  ADMIN = 2,
  MANAGER = 3,
}

export enum CompanySize {
  JUST_ME = 0, //"It's just me",
  SMALL = 1, //'2-9 employees',
  MEDIUM = 2, //'10-99 employees',
  LARGE = 3, //'100-1000 employees',
  VERY_LARGE = 4, //'More than 100 employees',
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

export enum ProjectScopeFlag {
  OneToThreeMonth = 0,
  ThreeToSixMonth = 1
}