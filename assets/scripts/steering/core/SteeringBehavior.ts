import { Component, Node, Vec3, v3 } from '../../cc-mock';
import { SteeringForce } from './SteeringForce';
import { SteeringConfig } from './SteeringConfig';

// Forward declaration to resolve circular dependency
export interface ISteeringAgent {
    velocity: Vec3;
    config: SteeringConfig;
    radius: number;
    findNearbyAgents(radius: number): any[];
    findNearbyObstacles(radius: number): Node[];
    getHeading(): Vec3;
    getPosition(): Vec3;
    getVelocity(): Vec3;
}

/**
 * Base class for all steering behaviors
 * Each specific behavior should extend this class and implement calculateSteering()
 */
// // @ccclass('SteeringBehavior')
export abstract class SteeringBehavior extends Component {
    // // @property({ range: [0, 10], slide: true })
    public weight: number = 1.0;

    // @property
    public enabled: boolean = true;

    protected agent: ISteeringAgent = null;

    onLoad() {
        // Get reference to the steering agent - we'll import it dynamically to avoid circular dependency
        this.agent = this.node.getComponent('SteeringAgent') as ISteeringAgent;
        if (!this.agent) {
            console.warn(`SteeringBehavior on ${this.node.name} requires a SteeringAgent component`);
        }
    }

    /**
     * Calculate the steering force for this behavior
     * Must be implemented by subclasses
     */
    abstract calculateSteering(): SteeringForce;

    /**
     * Get the weighted steering force
     */
    public getWeightedSteering(): SteeringForce {
        if (!this.enabled || !this.agent) {
            return SteeringForce.zero();
        }

        const steering = this.calculateSteering();
        steering.weight *= this.weight;
        return steering;
    }

    /**
     * Helper method to calculate seek behavior towards a target
     */
    protected seek(target: Vec3): Vec3 {
        if (!this.agent) return v3(0, 0, 0);

        const desired = new Vec3();
        Vec3.subtract(desired, target, this.node.worldPosition);
        desired.normalize().multiplyScalar(this.agent.config.maxSpeed);

        const steer = new Vec3();
        Vec3.subtract(steer, desired, this.agent.velocity);
        return steer;
    }

    /**
     * Helper method to calculate flee behavior away from a target
     */
    protected flee(target: Vec3): Vec3 {
        if (!this.agent) return v3(0, 0, 0);

        const desired = new Vec3();
        Vec3.subtract(desired, this.node.worldPosition, target);
        desired.normalize().multiplyScalar(this.agent.config.maxSpeed);

        const steer = new Vec3();
        Vec3.subtract(steer, desired, this.agent.velocity);
        return steer;
    }

    /**
     * Helper method to limit a vector's magnitude
     */
    protected limitVector(vector: Vec3, maxMagnitude: number): Vec3 {
        if (vector.lengthSqr() > maxMagnitude * maxMagnitude) {
            vector.normalize().multiplyScalar(maxMagnitude);
        }
        return vector;
    }
}