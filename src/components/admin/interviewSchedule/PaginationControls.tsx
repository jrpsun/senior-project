// components/PaginationControls.tsx
interface Props {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onNextPage: () => void;
    onPrevPage: () => void;
}

export const PaginationControls: React.FC<Props> = ({
    currentPage,
    itemsPerPage,
    totalItems,
    onItemsPerPageChange,
    onNextPage,
    onPrevPage
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="flex justify-between flex-row mt-6 items-center">
            <div className="items-center">
                <span className="mx-2 text-[#565656] text-sm">จำนวนรายการที่แสดง</span>
                <select
                    value={itemsPerPage}
                    onChange={onItemsPerPageChange}
                    className="border border-[#C4C4C4] rounded-[10px] w-[80px] p-0.5 text-sm focus:outline-none focus:ring-0"
                >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={totalItems}>ทั้งหมด</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">
                    {totalItems === 0
                        ? "0 รายการ"
                        : `${startIndex + 1}-${endIndex} จาก ${totalItems}`}
                </span>

                <button
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                    className="border-2 border-solid border-gray-300 px-3 py-2 rounded-md"
                >
                    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.4 6.5L8 11.1L6.6 12.5L0.6 6.5L6.6 0.5L8 1.9L3.4 6.5Z" fill="#1D1B20" />
                    </svg>
                </button>

                <span className="bg-[#008A90] px-3 py-[6px] rounded-md text-white">{currentPage}</span>

                <button
                    onClick={onNextPage}
                    disabled={endIndex >= totalItems}
                    className="border-2 border-solid border-gray-300 px-3 py-2 rounded-md"
                >
                    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.13125 6.5L0.53125 1.9L1.93125 0.5L7.93125 6.5L1.93125 12.5L0.53125 11.1L5.13125 6.5Z" fill="#1D1B20" />
                    </svg>
                </button>
            </div>
        </div>
    );
};