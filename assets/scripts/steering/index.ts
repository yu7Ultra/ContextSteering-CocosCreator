/**
 * ContextSteering-CocosCreator Library
 * A comprehensive steering behavior system for Cocos Creator 3.8+
 */

// Core system exports
export { SteeringAgent } from './core/SteeringAgent';
export { SteeringBehavior } from './core/SteeringBehavior';
export { SteeringForce } from './core/SteeringForce';
export { SteeringConfig, DEFAULT_STEERING_CONFIG, BehaviorWeights, DEFAULT_BEHAVIOR_WEIGHTS } from './core/SteeringConfig';

// Basic behavior exports
export { SeekBehavior } from './behaviors/SeekBehavior';
export { FleeBehavior } from './behaviors/FleeBehavior';
export { ArriveBehavior } from './behaviors/ArriveBehavior';
export { PursueBehavior } from './behaviors/PursueBehavior';
export { EvadeBehavior } from './behaviors/EvadeBehavior';

// Group behavior exports
export { SeparationBehavior } from './behaviors/SeparationBehavior';
export { AlignmentBehavior } from './behaviors/AlignmentBehavior';
export { CohesionBehavior } from './behaviors/CohesionBehavior';
export { FlockBehavior } from './behaviors/FlockBehavior';

// Navigation behavior exports
export { ObstacleAvoidanceBehavior } from './behaviors/ObstacleAvoidanceBehavior';
export { WallFollowingBehavior } from './behaviors/WallFollowingBehavior';
export { PathFollowingBehavior, PathPoint } from './behaviors/PathFollowingBehavior';

// Utility exports
export { SteeringUtils } from './utils/SteeringUtils';

// Re-export Vec3 utilities from cc-mock for convenience
export { Vec3, v3 } from '../cc-mock';

/**
 * Library version information
 */
export const VERSION = "1.0.0";

/**
 * Quick setup function for common steering behaviors
 */
import { Node } from '../cc-mock';
import { SteeringAgent } from './core/SteeringAgent';

export class SteeringSetup {
    /**
     * Setup a basic seeking agent
     */
    static setupSeeker(node: Node, target: Node): SteeringAgent {
        const agent = node.addComponent(SteeringAgent) as SteeringAgent;
        const seekBehavior = node.addComponent('SeekBehavior') as any;
        seekBehavior.target = target;
        return agent;
    }

    /**
     * Setup a flocking agent
     */
    static setupFlockAgent(node: Node): SteeringAgent {
        const agent = node.addComponent(SteeringAgent) as SteeringAgent;
        const flockBehavior = node.addComponent('FlockBehavior') as any;
        return agent;
    }

    /**
     * Setup an obstacle avoiding agent
     */
    static setupObstacleAvoider(node: Node): SteeringAgent {
        const agent = node.addComponent(SteeringAgent) as SteeringAgent;
        const obstacleAvoidance = node.addComponent('ObstacleAvoidanceBehavior') as any;
        return agent;
    }

    /**
     * Setup a path following agent
     */
    static setupPathFollower(node: Node, waypoints: any[]): SteeringAgent {
        const agent = node.addComponent(SteeringAgent) as SteeringAgent;
        const pathBehavior = node.addComponent('PathFollowingBehavior') as any;
        pathBehavior.setPath(waypoints);
        return agent;
    }

    /**
     * Setup a complete AI agent with multiple behaviors
     */
    static setupCompleteAgent(node: Node): SteeringAgent {
        const agent = node.addComponent(SteeringAgent) as SteeringAgent;
        
        // Add flocking behaviors
        const separation = node.addComponent('SeparationBehavior') as any;
        const alignment = node.addComponent('AlignmentBehavior') as any;
        const cohesion = node.addComponent('CohesionBehavior') as any;
        
        // Add obstacle avoidance
        const obstacleAvoidance = node.addComponent('ObstacleAvoidanceBehavior') as any;
        
        // Set appropriate weights
        separation.weight = 2.0; // Higher priority for safety
        alignment.weight = 1.0;
        cohesion.weight = 1.0;
        obstacleAvoidance.weight = 3.0; // Highest priority
        
        return agent;
    }
}