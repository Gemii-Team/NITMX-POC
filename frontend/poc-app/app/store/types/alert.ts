export interface ITransaction {
    id: string
    tranDateTime: string;
    sendingBank: number;
    sendingAccountNum: string;
    receivingBank: number;
    receivingAccountNum: string;
    merchantChannel: string;
    paymentType: number;
    amount: number; 
    fraude: string;
    acc: number
}

export interface ITransactionFilter {
    sendingBank?: number;
    receivingBank?: number;
    merchantChannel?: string;
    paymentType?: number;
    fraude?: string;
    fromAmount?: number;
    toAmount?: number;
    fromDate?: string;
    toDate?: string;
}

export interface IPaginationQuery {
    page: number;
    pageSize: number;
}

interface ITransactionRes {
    id: string;
    amount: number;
    merchant_channel: string;
    payment_type: number;
    receiving_account_number: string;
    receiving_bank: number;
    sending_account_number: string;
    sending_bank: number;
    tran_date_time: string;
    fraude: string;
    acc: number
}

export interface Node {
    id: string;
    label: string;
}

export interface Edge {
    id: string;
    from: string;
    to: string;
    amount: number;
    title: string;
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}

export interface ITransactionResponse {
    data: ITransactionRes[];
    total: number;
    page: number;
    totalPages: number;
}