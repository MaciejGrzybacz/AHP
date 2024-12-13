'use client'

import React from 'react';
import Matrix from "./Matrix"
import type { Matrix as MatrixType } from '@/lib/ahp';

interface ExpertTabProps {
    expert: string;
    criteria: string[];
    alternatives: string[];
    criteriaMatrix: MatrixType;
    alternativeMatrices: {
        [criterion: string]: MatrixType;
    };
    onCriteriaChange: (i: number, j: number, value: number) => void;
    onAlternativeChange: (criterion: string, i: number, j: number, value: number) => void;
}

export function ExpertTab({
                              expert,
                              criteria,
                              alternatives,
                              criteriaMatrix,
                              alternativeMatrices,
                              onCriteriaChange,
                              onAlternativeChange
                          }: ExpertTabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-medium">Porównanie kryteriów</h3>
                <Matrix
                    labels={criteria}
                    matrix={criteriaMatrix}
                    onChange={(value, type, ...indices) => {
                        if (type === 'value') {
                            const [i, j] = indices;
                            onCriteriaChange(i, j, value);
                        }
                    }}
                />
            </div>

            {criteria.map((criterion, criterionIndex) => (
                <div key={criterion} className="space-y-4">
                    <h3 className="font-medium">Porównanie alternatyw dla {criterion}</h3>
                    <Matrix
                        labels={alternatives}
                        matrix={alternativeMatrices[criterion]}
                        onChange={(value, type, ...indices) => {
                            if (type === 'value') {
                                const [i, j] = indices;
                                onAlternativeChange(criterion, i, j, value);
                            }
                        }}
                    />
                </div>
            ))}
        </div>
    );
}