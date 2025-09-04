/**
 * Configuration interface for steering behaviors
 */
export interface SteeringConfig {
    // Basic movement parameters
    maxSpeed: number;
    maxForce: number;
    mass: number;

    // Arrival behavior parameters
    arrivalRadius: number;
    slowDownRadius: number;

    // Group behavior parameters (for flocking)
    separationRadius: number;
    alignmentRadius: number;
    cohesionRadius: number;

    // Obstacle avoidance parameters
    obstacleAvoidanceDistance: number;
    maxSeeAhead: number;

    // Wall following parameters
    wallFollowDistance: number;
    wallFollowForce: number;

    // Path following parameters
    pathFollowRadius: number;
    pathSeekRadius: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_STEERING_CONFIG: SteeringConfig = {
    maxSpeed: 200,
    maxForce: 100,
    mass: 1,

    arrivalRadius: 20,
    slowDownRadius: 100,

    separationRadius: 50,
    alignmentRadius: 80,
    cohesionRadius: 100,

    obstacleAvoidanceDistance: 150,
    maxSeeAhead: 100,

    wallFollowDistance: 30,
    wallFollowForce: 50,

    pathFollowRadius: 20,
    pathSeekRadius: 50
};

/**
 * Behavior weights for combining multiple steering behaviors
 */
export interface BehaviorWeights {
    seek: number;
    flee: number;
    arrive: number;
    pursue: number;
    evade: number;
    separation: number;
    alignment: number;
    cohesion: number;
    obstacleAvoidance: number;
    wallFollowing: number;
    pathFollowing: number;
    wander: number;
}

/**
 * Default behavior weights
 */
export const DEFAULT_BEHAVIOR_WEIGHTS: BehaviorWeights = {
    seek: 1.0,
    flee: 1.0,
    arrive: 1.0,
    pursue: 1.0,
    evade: 1.0,
    separation: 2.0, // Higher priority to avoid collisions
    alignment: 1.0,
    cohesion: 1.0,
    obstacleAvoidance: 3.0, // Highest priority for safety
    wallFollowing: 1.5,
    pathFollowing: 2.0,
    wander: 0.5 // Lower priority, only when nothing else to do
};