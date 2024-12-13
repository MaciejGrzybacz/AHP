import React from 'react';

interface TableProps {
    headers: string[];
    data: (string | number)[][];
    striped?: boolean;
}

const Table: React.FC<TableProps> = ({ headers, data, striped = true }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 text-white">
                <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th
                            key={index}
                            className="py-2 px-4 border-b text-left"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr
                        key={rowIndex}
                        className={striped && rowIndex % 2 === 1 ? 'bg-gray-700' : ''}
                    >
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-2 px-4 border-b">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;