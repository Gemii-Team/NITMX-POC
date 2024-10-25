import { create } from 'zustand';
import { fetchClient } from '../utils/fetchClient';
import { ITransaction, ITransactionFilter, IPaginationQuery, ITransactionResponse } from './types/alert';


interface ITransactionStore {
    transactions: ITransaction[];
    loading: boolean;
    pagination: IPaginationQuery;
    filter: ITransactionFilter;
    totalRecords: number;
    totalPages: number;
    currentPage: number;

    fetchAlert: () => Promise<void>;
    setPagination: (pagination: Partial<IPaginationQuery>) => void;
    setFilter: (filter: Partial<ITransactionFilter>) => void;
    resetFilters: () => void;
}

const DEFAULT_PAGE_SIZE = 50;

export const useAlertStore = create<ITransactionStore>((set, get) => ({
    transactions: [],
    loading: false,
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    pagination: {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
    },
    filter: {},

    setPagination: (newPagination: Partial<IPaginationQuery>) => {
        const currentState = get();
        const updatedPagination = {
            ...currentState.pagination,
            ...newPagination,
        };
        set({ pagination: updatedPagination });
        currentState.fetchAlert();
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
        currentState.fetchAlert();
    },

    resetFilters: () => {
        const currentState = get();
        set({ 
            filter: {},
            pagination: { ...currentState.pagination, page: 1 }
        });
        currentState.fetchAlert();
    },

    fetchAlert: async () => {
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

            const url = `/alert/list?${queryParams.toString()}`;
            const response: ITransactionResponse = await fetchClient(url);
            
            if (response){
                set({
                    transactions: response.data.map((transaction) => ({
                        amount: transaction.amount,
                        acc: transaction.acc,
                        id: transaction.id,
                        fraude: transaction.fraude,
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

}));

