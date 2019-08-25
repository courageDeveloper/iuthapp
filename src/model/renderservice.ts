export interface RenderService {
    id?: string,
    rev?: string,
    servicename: string,
    branch: string,
    department: string,
    cost: number,
    sales: Array<any>
}
