type Matrix = number[][];

interface ExpertMatrices {
    [expert: string]: {
        criteria: Matrix;
        alternatives: {
            [criterion: string]: Matrix;
        };
    };
}

interface Results {
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
}

export const createIdentityMatrix = (size: number): Matrix => {
    return Array(size)
        .fill(0)
        .map(() => Array(size).fill(1));
};

const calculateGeometricMean = (values: number[]): number => {
    const product = values.reduce((acc, val) => acc * val, 1);
    return Math.pow(product, 1 / values.length);
};

const aggregateMatrices = (matrices: Matrix[]): Matrix => {
    const size = matrices[0].length;
    const result = Array(size)
        .fill(0)
        .map(() => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const values = matrices.map((matrix) => matrix[i][j]);
            result[i][j] = calculateGeometricMean(values);
        }
    }

    return result;
};

const calculatePriorityVector = (matrix: Matrix): number[] => {
    const n = matrix.length;

    const rowProducts = matrix.map(row =>
        row.reduce((acc, val) => acc * val, 1)
    );

    const nthRoots = rowProducts.map(product =>
        Math.pow(product, 1/n)
    );

    const sum = nthRoots.reduce((acc, val) => acc + val, 0);
    return nthRoots.map(val => val / sum);
};

const calculateCI = (matrix: Matrix): number => {
    const n = matrix.length;
    if (n < 2) return 0;

    const weights = calculatePriorityVector(matrix);

    const weightedSums = matrix.map((row) => {
        return row.reduce((sum, val, j) => sum + val * weights[j], 0);
    });

    const lambdas = weightedSums.map((sum, i) => sum / weights[i]);

    const lambdaMax = lambdas.reduce((sum, lambda) => sum + lambda, 0) / n;

    return (lambdaMax - n) / (n - 1);
};

export const calculateResults = (
    experts: string[],
    criteria: string[],
    alternatives: string[],
    matrices: ExpertMatrices
): Results => {
    const criteriaMatrices = experts.map(expert => matrices[expert].criteria);
    const aggregatedCriteriaMatrix = aggregateMatrices(criteriaMatrices);
    const criteriaWeights = calculatePriorityVector(aggregatedCriteriaMatrix);
    const criteriaCI = calculateCI(aggregatedCriteriaMatrix);

    const aggregatedAlternativeMatrices: Record<string, Matrix> = {};
    const alternativeWeights: Record<string, number[]> = {};
    const alternativeCIs: Record<string, number> = {};

    criteria.forEach(criterion => {
        const matricesForCriterion = experts.map(
            expert => matrices[expert].alternatives[criterion]
        );
        const aggregatedMatrix = aggregateMatrices(matricesForCriterion);

        aggregatedAlternativeMatrices[criterion] = aggregatedMatrix;
        alternativeWeights[criterion] = calculatePriorityVector(aggregatedMatrix);
        alternativeCIs[criterion] = calculateCI(aggregatedMatrix);
    });

    const alternativeScores = alternatives.map((_, altIndex) =>
        criteria.reduce((score, criterion, critIndex) =>
                score + criteriaWeights[critIndex] * alternativeWeights[criterion][altIndex],
            0
        )
    );

    const expertsWeights = experts.reduce((acc, expert) => ({
        ...acc,
        [expert]: {
            criteriaWeights: calculatePriorityVector(matrices[expert].criteria),
            alternativeWeights: criteria.reduce((innerAcc, criterion) => ({
                ...innerAcc,
                [criterion]: calculatePriorityVector(matrices[expert].alternatives[criterion])
            }), {})
        }
    }), {});
    console.log('CI values in ahp.ts:', criteriaCI, alternativeCIs);
    return {
        expertsWeights,
        criteriaWeights,
        alternativeScores,
        consistencyRatios: {
            criteria: criteriaCI,
            alternatives: alternativeCIs
        }
    };
};

export type { Matrix, ExpertMatrices, Results };