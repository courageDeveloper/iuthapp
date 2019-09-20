export interface Products {
    id?: string,
    rev?: string,
    productname: string,
    productcatid: string,
    productimage: any,
    subgroup: string,
    datesupplied: any,
    branch: string,
    store: string,
    refund: any,
    attachments: any,
    stockvalue: number,
    totalsubitem: number,
    unitstock: number,
    expenseid: string,
    expiryDate: any,
    color: string,
    errormessage: string;
    isexpired: any;
    isoncredit: any;
    isowing: any;
    iscompletepayment: any;
    isdispatched: any;
    sales: Array<any>
}
