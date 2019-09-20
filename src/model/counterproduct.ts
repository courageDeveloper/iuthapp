export interface CounterProducts {
    id?: string,
    rev?: string,
    productname: string,
    productimage: any,    
    productcategory: any,
    productid: string,
    datesupplied: any,
    branch: string,
    department: string,  
    suppliedunit: number  
    totalsubitem: number,
    color: string,
    errormessage: string;
    isexpired: any;
    return: any,
    barcode: any,
    sourcedepartment: string,
    unitsellingprice: number,
    subitemsellingprice: number,
    isUnitSelling: any,
    expirydate: any,
    productcatid: string,
    costprice: number,
    dispatchid: string,
    refund: any,
    sales: Array<any>
}
