'use client';

import React from 'react';
import type { Matrix as MatrixType } from '@/lib/ahp';

interface MatrixProps {
    labels: string[];
    matrix: MatrixType;
    onChange: (value: number, type: 'value', i: number, j: number) => void;
}

const AHP_SCALE = [
    { value: 1/9, label: "1/9" },
    { value: 1/8, label: "1/8" },
    { value: 1/7, label: "1/7" },
    { value: 1/6, label: "1/6" },
    { value: 1/5, label: "1/5" },
    { value: 1/4, label: "1/4" },
    { value: 1/3, label: "1/3" },
    { value: 1/2, label: "1/2" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" }
];

const Matrix: React.FC<MatrixProps> = ({ labels, matrix, onChange }) => {
    const handleChange = (i: number, j: number, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            onChange(numValue, 'value', i, j);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse table-fixed">
                <colgroup>
                    <col className="w-[200px]" />
                    {labels.map((_, index) => (
                        <col key={index} className="w-[120px]" />
                    ))}
                </colgroup>
                <thead>
                <tr>
                    <th className="p-2 bg-gray-800 text-left font-medium"></th>
                    {labels.map((label, index) => (
                        <th key={index} className="p-2 bg-gray-800 text-white text-center font-medium truncate">
                            {label}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {matrix.map((row, i) => (
                    <tr key={i}>
                        <th className="p-2 bg-gray-800 text-white text-left font-medium truncate">
                            {labels[i]}
                        </th>
                        {row.map((cell, j) => (
                            <td key={j} className="p-2">
                                <div className="flex justify-center">
                                    {i === j ? (
                                        <div className="w-20 text-center bg-gray-700 p-2 rounded">1</div>
                                    ) : i < j ? (
                                        <select
                                            value={cell}
                                            onChange={(e) => handleChange(i, j, e.target.value)}
                                            className="w-20 p-2 bg-gray-700 text-white rounded border border-gray-600 text-center cursor-pointer hover:bg-gray-600 transition-colors"
                                        >
                                            {AHP_SCALE.map(({ value, label }) => (
                                                <option key={label} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-20 text-center text-gray-400 bg-gray-700 p-2 rounded">
                                            {(1 / matrix[j][i]).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Matrix;