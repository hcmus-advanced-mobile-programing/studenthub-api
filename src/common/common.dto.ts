export type FormData<T> = {
    [P in keyof T]: T[P] extends Array<any> ? T[P] : T[P] | string;
};

export interface ICommonAttr {
    id: number | string;
    createdAt: Date;
    updatedAt: Date;
  }


  
  export interface IDAndName {
    id: string | number;
    fullname: string | null; // Update fullname to allow null values
  }