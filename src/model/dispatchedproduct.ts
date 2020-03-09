export interface DispatchedProducts {
    id?: string,
    rev?: string,
    productname: string,
    productid: string,
    dispatchdepartment: any,
    dispatched: any,
    datedispatched: any,
    branch: string,
    unitquantity: number,
    sourcedepartment: string,
    costprice: number,
    subitemno: number
    return: any,
    sales: Array<any>
}
