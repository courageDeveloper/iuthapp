export interface Department {
    id?: string,
    rev?: string,
    debt: number,
    loanstatus: string,
    departmentowed: string,
    dateofloan: any,
    branch: string,
    staffs: Array<string>
}
