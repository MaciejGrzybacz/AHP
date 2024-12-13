'use client';

import React from 'react';
import Table from '@/components/ui/table';

interface ResultsProps {
    results: {
        expertsWeights: {
            [expert: string]: {
                criteriaWeights: number[];
                alternativeWeights: {
                    [criterion: string]: number[];
                };
            };
        };
        criteriaWeights: number[];
        alternativeScores: number[];
        consistencyRatios: {
            criteria: number;
            alternatives: { [criterion: string]: number };
        };
    };
    experts: string[];
    criteria: string[];
    alternatives: string[];
}

const Results: React.FC<ResultsProps> = ({ results, experts, criteria, alternatives }) => {
    const { alternativeScores, consistencyRatios, criteriaWeights } = results;

    const alternativeData = alternatives.map((alternative, index) => ({
        name: alternative,
        score: alternativeScores[index],
        display: `${(alternativeScores[index] * 100).toFixed(2)}%`
    }))
        .sort((a, b) => b.score - a.score)
        .map(item => [item.name, item.display]);

    const criteriaData = criteria.map((criterion, index) => [
        criterion,
        `${(criteriaWeights[index] * 100).toFixed(2)}%`
    ]);

    const consistencyData = [
        ['Kryteria', `${(consistencyRatios.criteria * 100).toFixed(2)}%`,
            consistencyRatios.criteria < 0.1 ? 'OK' : 'Zbyt wysoki']
    ];

    Object.keys(consistencyRatios.alternatives).forEach((criterion) => {
        consistencyData.push([
            `Alternatywy - ${criterion}`,
            `${(consistencyRatios.alternatives[criterion] * 100).toFixed(2)}%`,
            consistencyRatios.alternatives[criterion] < 0.1 ? 'OK' : 'Zbyt wysoki'
        ]);
    });

    return (
        <div className="mt-6 space-y-8">
            <h2 className="text-2xl font-semibold text-white">Wyniki AHP</h2>

            <div>
                <h3 className="text-xl font-medium mb-4 text-white">Ranking Końcowy Alternatyw</h3>
                <Table
                    headers={['Alternatywa', 'Wynik']}
                    data={alternativeData}
                    striped
                />
            </div>

            <div>
                <h3 className="text-xl font-medium mb-4 text-white">Wagi Kryteriów</h3>
                <Table
                    headers={['Kryterium', 'Waga']}
                    data={criteriaData}
                    striped
                />
            </div>

            <div>
                <h3 className="text-xl font-medium mb-4 text-white">Indeksy niespójności (CI)</h3>
                <Table
                    headers={['Typ', 'Wartość CI', 'Ocena']}
                    data={consistencyData}
                    striped
                />
            </div>
        </div>
    );
};

export default Results;