import { create } from 'zustand';
import { fetchClient } from '../utils/fetchClient';
import { ITransaction, ITransactionFilter, IPaginationQuery, ITransactionResponse, GraphData, Node, Edge } from './types/transactions';

interface ITransactionStore {
    transactions: ITransaction[];
    loading: boolean;
    pagination: IPaginationQuery;
    filter: ITransactionFilter;
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    transactionGraph: GraphData;
    graphState: boolean;

    setGreaphState: (state: boolean) => void;
    fetchTransactionGraph: ({ accountNumber, depth }: {accountNumber: string, depth: number}) => Promise<void>;
    fetchTransactions: () => Promise<void>;
    setPagination: (pagination: Partial<IPaginationQuery>) => void;
    setFilter: (filter: Partial<ITransactionFilter>) => void;
    resetFilters: () => void;
}

const DEFAULT_PAGE_SIZE = 50;

export const useTransaction = create<ITransactionStore>((set, get) => ({
    transactions: [],
    loading: false,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    graphState: false,
    transactionGraph: {
        nodes: [],
        edges: [],
    },
    pagination: {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
    },
    filter: {},

    setGreaphState: (state: boolean) => {
        set({ graphState: state });
    },

    setPagination: (newPagination: Partial<IPaginationQuery>) => {
        const currentState = get();
        const updatedPagination = {
            ...currentState.pagination,
            ...newPagination,
        };
        set({ pagination: updatedPagination });
        currentState.fetchTransactions();
    },

    setFilter: (newFilter: Partial<ITransactionFilter>) => {
        const currentState = get();
        const updatedFilter = {
            ...currentState.filter,
            ...newFilter,
        };
        set({ 
            filter: updatedFilter,
            pagination: { ...currentState.pagination, page: 1 } 
        });
        currentState.fetchTransactions();
    },

    resetFilters: () => {
        const currentState = get();
        set({ 
            filter: {},
            pagination: { ...currentState.pagination, page: 1 }
        });
        currentState.fetchTransactions();
    },

    fetchTransactions: async () => {
        const state = get();
        set({ loading: true });

        try {
            const queryParams = new URLSearchParams();

            queryParams.append('page', state.pagination.page.toString());
            queryParams.append('page_size', state.pagination.pageSize.toString());

            Object.entries(state.filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const url = `/transaction/list?${queryParams.toString()}`;
            const response: ITransactionResponse = await fetchClient(url);
            console.log('response', response);
            if (response){
                set({
                    transactions: response.data.map((transaction) => ({
                        amount: transaction.amount,
                        fraud: transaction.fraud,
                        merchantChannel: transaction?.merchant_channel,
                        paymentType: transaction.payment_type,
                        receivingAccountNum: transaction.receiving_account_number,
                        receivingBank: transaction.receiving_bank,
                        sendingAccountNum: transaction.sending_account_number,
                        sendingBank: transaction.sending_bank,
                        tranDateTime: transaction.tran_date_time,
                    })),
                    totalRecords: response.total,
                    totalPages: response.totalPages,
                    currentPage: response.page,
                    loading: false,
                });
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            set({
                loading: false,
                transactions: [],
            });
        }
    },

    fetchTransactionGraph: async ({ accountNumber, depth }: {accountNumber: string, depth: number}) => {
        const state = get();
        set({ loading: true, transactionGraph: { nodes: [], edges: [] }, graphState: false });

        try {
            const queryParams = new URLSearchParams();

            queryParams.append('accountNumber', accountNumber);
            queryParams.append('depth', depth.toString());

            Object.entries(state.filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const url = `/transaction/graph?${queryParams.toString()}`;
            const response: {
                nodes: Node[];
                edges: Edge[];
            } = await fetchClient(url);
            if (response){

                set({
                    transactionGraph: response,
                    loading: false,
                    graphState: true,
                });
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            set({
                loading: false,
                transactionGraph: { nodes: [], edges: [] },
                graphState: false,
            });
        }
    },
}));

