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
  Active = 1,
  Offer = 2,
  Hired = 3,
}

export enum DisableFlag {
  Enable = 0,
  Disable = 1,
}

export enum TypeFlag {
  New = 0,
  Working = 1,
  Archieved = 2,
}

export enum ProjectStatusFlag {
  Working = 0,
  Success = 1,
  Fail = 2,
}

export enum ProjectScopeFlag {
  LessThanOneMOnth = 0,
  OneToThreeMonth = 1,
  ThreeToSixMonth = 2,
  MoreThanSixMOnth = 3,
}

export enum MessageFlag {
  Message = 0,
  Interview = 1,
}

export enum NotifyFlag {
  Unread = 0,
  Read = 1,
}

export enum TypeNotifyFlag {
  Offer = 0,
  Interview = 1,
  Submitted = 2,
  Chat = 3,
}

export const statusFlagToTypeNotifyMap: Record<StatusFlag, TypeNotifyFlag> = {
  [StatusFlag.Waitting]: TypeNotifyFlag.Submitted,
  [StatusFlag.Active]: TypeNotifyFlag.Chat,
  [StatusFlag.Offer]: TypeNotifyFlag.Offer,
  [StatusFlag.Hired]: TypeNotifyFlag.Offer,
};
