export interface ProductCategory {
    id?: string,
    rev?: string,
    subgroup: string,
    costprice: number,
    productname: string,
    subitemno: number,
    branch: string,
    department: string,
    products: Array<any>
}
