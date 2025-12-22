// AI Traffic Signal Control Logic

import type {
    Direction,
    TrafficMode,
    IntersectionState,
    AIDecision,
    Vehicle,
} from './types';

/**
 * Calculate priority score for each direction based on queue length,
 * waiting time, and traffic density
 */
export function calculatePriorityScores(
    intersection: IntersectionState,
    vehicles: Vehicle[]
): Record<Direction, number> {
    const directions: Direction[] = ['north', 'south', 'east', 'west'];
    const scores: Record<Direction, number> = {
        north: 0,
        south: 0,
        east: 0,
        west: 0,
    };

    directions.forEach((direction) => {
        // Base score from queue length (0-100)
        const queueScore = Math.min(intersection.queueLengths[direction] * 10, 100);

        // Density score (vehicles approaching in that lane)
        const densityScore = Math.min(intersection.vehicleDensity[direction] * 5, 50);

        // Emergency vehicle bonus
        const emergencyBonus = intersection.emergencyPresent[direction] ? 200 : 0;

        // Calculate average wait time for vehicles in this direction
        const vehiclesInDirection = vehicles.filter(
            (v) => v.direction === direction && !v.hasPassedIntersection
        );
        const avgWaitTime = vehiclesInDirection.length > 0
            ? vehiclesInDirection.reduce((sum, v) => sum + v.waitTime, 0) / vehiclesInDirection.length
            : 0;
        const waitTimeScore = Math.min(avgWaitTime / 10, 50);

        scores[direction] = queueScore + densityScore + waitTimeScore + emergencyBonus;
    });

    return scores;
}

/**
 * Determine optimal green light duration based on traffic conditions
 */
export function calculateGreenDuration(
    direction: Direction,
    intersection: IntersectionState,
    mode: TrafficMode
): number {
    if (mode === 'fixed') {
        return 15; // Fixed 15 seconds
    }

    const queueLength = intersection.queueLengths[direction];
    const density = intersection.vehicleDensity[direction];
    const hasEmergency = intersection.emergencyPresent[direction];

    if (hasEmergency && mode === 'emergency') {
        return 30; // Give emergency vehicles plenty of time
    }

    // Adaptive duration: 8-25 seconds based on queue and density
    const baseDuration = 8;
    const queueBonus = Math.min(queueLength * 2, 12);
    const densityBonus = Math.min(density * 1, 5);

    return baseDuration + queueBonus + densityBonus;
}

/**
 * Main AI decision-making function
 * Returns the next direction that should get green light
 */
export function makeTrafficDecision(
    intersection: IntersectionState,
    vehicles: Vehicle[],
    mode: TrafficMode,
    currentActiveDirection: Direction | null
): AIDecision {
    const scores = calculatePriorityScores(intersection, vehicles);

    // Check for emergency override
    const emergencyDirection = (['north', 'south', 'east', 'west'] as Direction[]).find(
        (dir) => intersection.emergencyPresent[dir]
    );

    let chosenDirection: Direction;
    let reasoning: string;
    let emergencyOverride = false;

    if (emergencyDirection && mode !== 'fixed') {
        // Emergency vehicle detected - prioritize that direction
        chosenDirection = emergencyDirection;
        reasoning = `🚨 Emergency vehicle detected in ${emergencyDirection} direction. Clearing path immediately.`;
        emergencyOverride = true;
    } else if (mode === 'fixed') {
        // Fixed timer mode - rotate through directions
        const rotationOrder: Direction[] = ['north', 'south', 'east', 'west'];
        const currentIndex = currentActiveDirection
            ? rotationOrder.indexOf(currentActiveDirection)
            : -1;
        chosenDirection = rotationOrder[(currentIndex + 1) % 4];
        reasoning = `⏱️ Fixed timer rotation: ${chosenDirection} direction's turn.`;
    } else {
        // Adaptive mode - choose highest priority
        chosenDirection = (Object.entries(scores) as [Direction, number][]).reduce((a, b) =>
            b[1] > a[1] ? b : a
        )[0];

        const topScore = scores[chosenDirection];
        const queueLen = intersection.queueLengths[chosenDirection];

        if (topScore < 20) {
            reasoning = `✅ Light traffic. Rotating to ${chosenDirection} direction.`;
        } else if (queueLen > 5) {
            reasoning = `🚗 High queue (${queueLen} vehicles) in ${chosenDirection}. Optimizing flow.`;
        } else {
            reasoning = `🧠 AI Priority: ${chosenDirection} direction (score: ${topScore.toFixed(0)})`;
        }
    }

    const greenDuration = calculateGreenDuration(chosenDirection, intersection, mode);

    return {
        timestamp: Date.now(),
        currentMode: mode,
        activeDirection: chosenDirection,
        reasoning,
        queueScores: scores,
        emergencyOverride,
        suggestedGreenDuration: greenDuration,
    };
}

/**
 * Simulate reinforcement learning-style reward calculation
 * (for educational visualization - not actual training)
 */
export function calculateReward(
    avgWaitTime: number,
    throughput: number,
    ambulanceResponseTime: number
): number {
    // Lower wait time = higher reward
    const waitReward = Math.max(0, 100 - avgWaitTime);

    // Higher throughput = higher reward
    const throughputReward = throughput * 2;

    // Faster ambulance = higher reward
    const ambulanceReward = ambulanceResponseTime > 0
        ? Math.max(0, 200 - ambulanceResponseTime * 10)
        : 0;

    return waitReward + throughputReward + ambulanceReward;
}
