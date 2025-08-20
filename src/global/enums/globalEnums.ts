export enum ENUM_MIMETYPE {
  pdf = "application/pdf",
  doc1 = "application/msword",
  doc2 = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt1 = "application/vnd.ms-powerpoint",
  ppt2 = "application/application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls1 = "application/vnd.ms-excel",
  xls2 = "application/vnd.openxmlformats-officedocument.spreadsheetml",
}
//
export enum ENUM_MONTH {
  january = "january",
  february = "february",
  march = "march",
  april = "april",
  may = "may",
  june = "june",
  july = "july",
  august = "august",
  september = "september",
  october = "october",
  november = "november",
  december = "december",
}
export type I_Month = keyof typeof ENUM_MONTH;
//
export enum ENUM_DAYS_OF_WEEK {
  saturday = "saturday",
  sunday = "sunday",
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
}
export type I_DayOfWeek = keyof typeof ENUM_DAYS_OF_WEEK;
//
