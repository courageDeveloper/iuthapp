export interface Patient {
    id?: string,
    rev?: string,    
    firstname: string,
    lastname: string,
    branch: string,
    department: string,
    dob: any,
    patientno: string,
    position: string,
    mobile: string,
    address: string,
    email: string,
    dateofregistration: any,
    sex: string,
    debt: number,
    sales: Array<string>
}
