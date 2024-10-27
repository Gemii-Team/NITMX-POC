import { create } from 'zustand';
import { fetchClient } from '../utils/fetchClient';
import { ITransaction, ITransactionResponse } from './types/transactions';

interface merchant {
    merchant_channel: string;
    count: number;
}

interface ITransactionStore {
    stat: { total_transactions: number, fraud_percentage: number, caution: number, warning: number}
    merchant: {data: merchant[] }
    latest: ITransaction[]
    loading: boolean;

    fetchStat: () => Promise<void>;
    fetchBarValue: () => Promise<void>;
    fetchLatestTransaction: () => Promise<void>;

}

export const useDash = create<ITransactionStore>((set) => ({
    stat: { total_transactions: 0, fraud_percentage: 0, caution: 0, warning: 0},
    merchant: {data: []},
    latest: [],
    loading: false,
    fetchStat: async () => {
        try {
            const data = await fetchClient('/stat/list', {
                method: 'GET',
                authRequired: true,
            });
            set({ stat: {total_transactions: data.total_transactions, fraud_percentage: data.fraud_percentage, caution: data.caution, warning: data.warning} });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    fetchBarValue: async () => {
        try {
            const data: { data: merchant[] } = await fetchClient('/stat/merchant', {
                method: 'GET',
                authRequired: true,
            });
            set({ merchant: {data: data.data} });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    fetchLatestTransaction: async () => {
        try {
            const data: ITransactionResponse  = await fetchClient('/transaction/list?page_size=10', {
                method: 'GET',
                authRequired: true,
            });
            set({ latest: data.data.map((item) => ({
                tranDateTime: item.tran_date_time,
                sendingBank: item.sending_bank,
                sendingAccountNum: item.sending_account_number,
                receivingBank: item.receiving_bank,
                receivingAccountNum: item.receiving_account_number,
                merchantChannel: item.merchant_channel,
                paymentType: item.payment_type,
                amount: item.amount,
                fraud: item.fraud,
            })) });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}));

