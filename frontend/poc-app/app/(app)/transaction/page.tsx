"use client"

import React from 'react';
import { useTransaction } from '@store/useTransaction';
import { Search, Filter, Loader2, RefreshCcw } from 'lucide-react';
import TransactionNetwork from '../components/transactionNetwork';

const TransactionTable = () => {
    const {
        transactions,
        loading,
        pagination,
        totalPages,
        totalRecords,
        filter,
        transactionGraph,
        graphState,

        setGreaphState,
        setPagination,
        setFilter,
        resetFilters,
        fetchTransactions,
        fetchTransactionGraph
    } = useTransaction();

    React.useEffect(() => {
        fetchTransactions();
    }, [
        fetchTransactions
    ]);

    return (
        <div className="w-full space-y-4">

            {/* Transaction Network */}
            {graphState && (
                <dialog id="transaction_modal" className={`modal ${graphState ? 'modal-open' : ''}`}>
                    <div className="modal-box w-11/12 max-w-5xl">
                        <form method="dialog">
                            <button
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                onClick={() => setGreaphState(false)}
                            >
                                ✕
                            </button>
                        </form>

                        <div className="modal-body">
                            <TransactionNetwork
                                data={transactionGraph}
                                onNodeSelect={(nodeId) => console.log('Selected Node:', nodeId)}
                            />
                        </div>

                    </div>
                </dialog>
            )}


            <div className="flex flex-col lg:flex-row gap-4 p-4 bg-base-200 rounded-box">
                <div className="join">
                    <input
                        type="date"
                        className="input join-item input-bordered"
                        value={filter.fromDate || ''}
                        onChange={(e) => setFilter({ fromDate: e.target.value })}
                    />
                    <input
                        type="date"
                        className="input join-item input-bordered"
                        value={filter.toDate || ''}
                        onChange={(e) => setFilter({ toDate: e.target.value })}
                    />
                </div>

                {/* Banks Filter */}
                <div className="join">
                    <select
                        className="select join-item select-bordered"
                        value={filter.sendingBank || ''}
                        onChange={(e) => setFilter({
                            sendingBank: e.target.value ? Number(e.target.value) : undefined
                        })}
                    >
                        <option value="">All Banks</option>
                        <option value="1">Bank A</option>
                        <option value="2">Bank B</option>
                        <option value="3">Bank C</option>
                        <option value="4">Bank D</option>
                        <option value="5">Bank E</option>
                    </select>
                </div>

                {/* Amount Range */}
                <div className="join">
                    <input
                        type="number"
                        placeholder="Min Amount"
                        className="input join-item input-bordered w-24"
                        value={filter.fromAmount || ''}
                        onChange={(e) => setFilter({
                            fromAmount: e.target.value ? Number(e.target.value) : undefined
                        })}
                    />
                    <input
                        type="number"
                        placeholder="Max Amount"
                        className="input join-item input-bordered w-24"
                        value={filter.toAmount || ''}
                        onChange={(e) => setFilter({
                            toAmount: e.target.value ? Number(e.target.value) : undefined
                        })}
                    />
                </div>

                {/* Banks Filter */}
                <div className="join">
                    <select
                        className="select join-item select-bordered"
                        value={filter.sendingBank || ''}
                        onChange={(e) => setFilter({
                            fraud: e.target.value ? Number(e.target.value) : undefined
                        })}
                    >
                        <option value="">All status</option>
                        <option value="0">Valid</option>
                        <option value="1">Fraud</option>
                    </select>
                </div>

                <button
                    className="btn btn-ghost"
                    onClick={resetFilters}
                >
                    <RefreshCcw size={20} />
                    Reset
                </button>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-box">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Transaction Time</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6}>
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="animate-spin mr-2" />
                                        Loading transactions...
                                    </div>
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <div className="flex flex-col items-center justify-center py-8 text-base-content/60">
                                        <Filter size={48} className="opacity-50 mb-2" />
                                        <p>No transactions found</p>
                                        {Object.keys(filter).length > 0 && (
                                            <button
                                                className="btn btn-ghost btn-sm mt-2"
                                                onClick={resetFilters}
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx, index) => (
                                <tr key={index} className="hover">
                                    <td className="whitespace-nowrap">
                                        <div className="font-medium">
                                            {tx.tranDateTime}
                                        </div>
                                        <div className="text-sm opacity-50">
                                            {tx.tranDateTime}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium">{tx.sendingAccountNum}</div>
                                        <div className="text-sm opacity-50">Bank {tx.sendingBank}</div>
                                    </td>
                                    <td>
                                        <div className="font-medium">{tx.receivingAccountNum}</div>
                                        <div className="text-sm opacity-50">Bank {tx.receivingBank}</div>
                                    </td>
                                    <td className="font-mono">
                                        {tx.amount.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'THB'
                                        })}
                                    </td>
                                    <td>
                                        <div className="badge badge-ghost">
                                            {tx.merchantChannel}
                                        </div>
                                    </td>
                                    <td>
                                        {tx.fraud === 1 ? (
                                            <div className="badge badge-error gap-2">
                                                Fraud
                                            </div>
                                        ) : (
                                            <div className="badge badge-success gap-2">
                                                Valid
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => fetchTransactionGraph({ accountNumber: tx.sendingAccountNum, depth: 1 })}
                                        >
                                            <Search size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
                <div className="text-sm text-base-content/70">
                    Showing {transactions.length} of {totalRecords} transactions
                </div>

                <div className="join">
                    <button
                        className="join-item btn"
                        disabled={pagination.page === 1}
                        onClick={() => setPagination({ page: pagination.page - 1 })}
                    >
                        «
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                        } else if (pagination.page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = pagination.page - 2 + i;
                        }

                        return (
                            <button
                                key={i}
                                className={`join-item btn ${pageNum === pagination.page ? 'btn-active' : ''}`}
                                onClick={() => setPagination({ page: pageNum })}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        className="join-item btn"
                        disabled={pagination.page === totalPages}
                        onClick={() => setPagination({ page: pagination.page + 1 })}
                    >
                        »
                    </button>
                </div>

                <select
                    className="select select-bordered w-full sm:w-auto"
                    value={pagination.pageSize}
                    onChange={(e) => setPagination({
                        pageSize: Number(e.target.value),
                        page: 1
                    })}
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                </select>
            </div>
        </div>
    );
};

export default TransactionTable;