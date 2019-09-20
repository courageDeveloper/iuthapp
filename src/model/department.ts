export interface Department {
    id?: string,
    rev?: string,
    name: string,
    debt: number,
    loanstatus: any,
    departmentowed: string,
    dateofloan: any,
    branch: string,
    staffs: Array<string>
}
