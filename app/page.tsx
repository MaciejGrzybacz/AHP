'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Download, Upload, Settings } from 'lucide-react';
import { ExpertTab } from '@/components/ExpertTab';
import Results from '@/components/Results';
import { calculateResults, createIdentityMatrix } from '@/lib/ahp';
import type { ExpertMatrices, Results as ResultsType } from '@/lib/ahp';

export default function Home() {
    const [isConfigurationMode, setIsConfigurationMode] = React.useState(true);
    const [isInitialSetup, setIsInitialSetup] = React.useState(true);
    const [experts, setExperts] = React.useState<string[]>(['Ekspert 1']);
    const [criteria, setCriteria] = React.useState<string[]>(['Kryterium 1', 'Kryterium 2']);
    const [alternatives, setAlternatives] = React.useState<string[]>(['Alternatywa 1', 'Alternatywa 2']);
    const [matrices, setMatrices] = React.useState<ExpertMatrices>({
        'Ekspert 1': {
            criteria: createIdentityMatrix(2),
            alternatives: {
                'Kryterium 1': createIdentityMatrix(2),
                'Kryterium 2': createIdentityMatrix(2)
            }
        }
    });
    const [results, setResults] = React.useState<ResultsType | null>(null);

    const updateMatrix = (
        expert: string,
        type: 'criteria' | 'alternatives',
        criterion: string | null,
        i: number,
        j: number,
        value: number
    ) => {
        setMatrices(prev => {
            const newMatrices = { ...prev };
            if (type === 'criteria') {
                newMatrices[expert] = {
                    ...prev[expert],
                    criteria: prev[expert].criteria.map((row, rowIndex) => {
                        if (rowIndex === i) {
                            return row.map((cell, cellIndex) =>
                                cellIndex === j ? value : cell
                            );
                        }
                        if (rowIndex === j) {
                            return row.map((cell, cellIndex) =>
                                cellIndex === i ? 1/value : cell
                            );
                        }
                        return row;
                    })
                };
            } else if (criterion) {
                newMatrices[expert] = {
                    ...prev[expert],
                    alternatives: {
                        ...prev[expert].alternatives,
                        [criterion]: prev[expert].alternatives[criterion].map((row, rowIndex) => {
                            if (rowIndex === i) {
                                return row.map((cell, cellIndex) =>
                                    cellIndex === j ? value : cell
                                );
                            }
                            if (rowIndex === j) {
                                return row.map((cell, cellIndex) =>
                                    cellIndex === i ? 1/value : cell
                                );
                            }
                            return row;
                        })
                    }
                };
            }
            return newMatrices;
        });
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = e.target?.result as string;
                const data = JSON.parse(json);
                setExperts(data.experts);
                setCriteria(data.criteria);
                setAlternatives(data.alternatives);
                setMatrices(data.matrices);
                setIsInitialSetup(false);
                setIsConfigurationMode(false);
                setResults(null);
            };
            reader.readAsText(file);
        }
    };

    const handleExport = () => {
        const data = {
            experts,
            criteria,
            alternatives,
            matrices,
            timestamp: new Date().toISOString()
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ahp-config-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isInitialSetup) {
        return (
            <div className="min-h-screen p-4 bg-gray-900">
                <Card className="max-w-xl mx-auto mt-10">
                    <CardHeader>
                        <CardTitle>Konfiguracja AHP</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Ręczna konfiguracja</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Liczba ekspertów:</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={experts.length}
                                            onChange={(e) => {
                                                const num = Math.max(1, parseInt(e.target.value) || 1);
                                                setExperts(Array.from({length: num}, (_, i) => `Ekspert ${i + 1}`));
                                            }}
                                            className="bg-gray-800 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Liczba kryteriów:</label>
                                        <Input
                                            type="number"
                                            min="2"
                                            value={criteria.length}
                                            onChange={(e) => {
                                                const num = Math.max(2, parseInt(e.target.value) || 2);
                                                setCriteria(Array.from({length: num}, (_, i) => `Kryterium ${i + 1}`));
                                            }}
                                            className="bg-gray-800 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Liczba alternatyw:</label>
                                        <Input
                                            type="number"
                                            min="2"
                                            value={alternatives.length}
                                            onChange={(e) => {
                                                const num = Math.max(2, parseInt(e.target.value) || 2);
                                                setAlternatives(Array.from({length: num}, (_, i) => `Alternatywa ${i + 1}`));
                                            }}
                                            className="bg-gray-800 text-white"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => {
                                            const newMatrices: ExpertMatrices = {};
                                            experts.forEach(expert => {
                                                newMatrices[expert] = {
                                                    criteria: createIdentityMatrix(criteria.length),
                                                    alternatives: Object.fromEntries(
                                                        criteria.map(criterion => [
                                                            criterion,
                                                            createIdentityMatrix(alternatives.length)
                                                        ])
                                                    )
                                                };
                                            });
                                            setMatrices(newMatrices);
                                            setIsInitialSetup(false);
                                        }}
                                        className="w-full"
                                    >
                                        Rozpocznij z tą konfiguracją
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-800 text-gray-400">LUB</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">Wczytaj z pliku</h3>
                                <div className="relative">
                                    <Input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImport}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                    />
                                    <Button variant="outline" className="w-full">
                                        <Upload className="h-4 w-4 mr-2"/>
                                        Wybierz plik JSON
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 bg-gray-900">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>
                            {isConfigurationMode ? 'Konfiguracja nazw' : 'Porównania parami'}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsConfigurationMode(!isConfigurationMode)}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                {isConfigurationMode ? 'Przejdź do porównań' : 'Edytuj nazwy'}
                            </Button>
                            <Button onClick={handleExport} variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Eksportuj
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isConfigurationMode ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sekcja ekspertów */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium mb-2">Nazwy ekspertów</h3>
                                <div className="space-y-2">
                                    {experts.map((expert, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={expert}
                                                onChange={(e) => {
                                                    const newExperts = [...experts];
                                                    const oldName = newExperts[index];
                                                    const newName = e.target.value;
                                                    newExperts[index] = newName;
                                                    setExperts(newExperts);

                                                    setMatrices(prev => {
                                                        const newMatrices = { ...prev };
                                                        newMatrices[newName] = prev[oldName];
                                                        delete newMatrices[oldName];
                                                        return newMatrices;
                                                    });
                                                }}
                                                className="bg-gray-800 text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sekcja kryteriów */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Nazwy kryteriów</h3>
                                <div className="space-y-2">
                                    {criteria.map((criterion, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={criterion}
                                                onChange={(e) => {
                                                    const newCriteria = [...criteria];
                                                    const oldName = newCriteria[index];
                                                    const newName = e.target.value;
                                                    newCriteria[index] = newName;
                                                    setCriteria(newCriteria);

                                                    setMatrices(prev => {
                                                        const newMatrices = { ...prev };
                                                        experts.forEach(expert => {
                                                            const expertMatrix = { ...newMatrices[expert] };
                                                            const alternatives = { ...expertMatrix.alternatives };
                                                            alternatives[newName] = alternatives[oldName];
                                                            delete alternatives[oldName];
                                                            expertMatrix.alternatives = alternatives;
                                                            newMatrices[expert] = expertMatrix;
                                                        });
                                                        return newMatrices;
                                                    });
                                                }}
                                                className="bg-gray-800 text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sekcja alternatyw */}
                            <div>
                                <h3 className="text-lg font-medium mb-2">Nazwy alternatyw</h3>
                                <div className="space-y-2">
                                    {alternatives.map((alternative, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={alternative}
                                                onChange={(e) => {
                                                    const newAlternatives = [...alternatives];
                                                    newAlternatives[index] = e.target.value;
                                                    setAlternatives(newAlternatives);
                                                }}
                                                className="bg-gray-800 text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Tabs defaultValue={experts[0]}>
                                <TabsList className="mb-4">
                                    {experts.map((expert) => (
                                        <TabsTrigger key={expert} value={expert}>
                                            {expert}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {experts.map((expert) => (
                                    <TabsContent key={expert} value={expert}>
                                        <ExpertTab
                                            expert={expert}
                                            criteria={criteria}
                                            alternatives={alternatives}
                                            criteriaMatrix={matrices[expert].criteria}
                                            alternativeMatrices={matrices[expert].alternatives}
                                            onCriteriaChange={(i, j, value) => {
                                                updateMatrix(expert, 'criteria', null, i, j, value);
                                            }}
                                            onAlternativeChange={(criterion, i, j, value) => {
                                                updateMatrix(expert, 'alternatives', criterion, i, j, value);
                                            }}
                                        />
                                    </TabsContent>
                                ))}
                            </Tabs>

                            <Button
                                onClick={() => {
                                    const result = calculateResults(experts, criteria, alternatives, matrices);
                                    setResults(result);
                                }}
                                className="w-full mt-6"
                            >
                                Oblicz wyniki
                            </Button>

                            {results && (
                                <Results
                                    results={results}
                                    experts={experts}
                                    criteria={criteria}
                                    alternatives={alternatives}
                                />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}