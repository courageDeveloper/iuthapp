export interface Vendor {
    id?: string,
    rev?: string,    
    fullname: string,
    branch: string,
    mobile: string,
    address: string,
    email: string,
    dateofregistration: any,
    bankname: string,
    accountnumber: string,
    balance: number,
    expenses: Array<string>
}
