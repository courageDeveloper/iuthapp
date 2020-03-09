export interface Department {
    id?: string,
    rev?: string,
    name: string,
    debt: number,
    loanstatus: any,
    departmentowed: string,
    dateofloan: any,
    branch: string,
    isswitchedtable: any,
    producthistory: Array<any>,
    staffs: Array<string>
}
