import { Node, Vec3, v3 } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';


/**
 * Arrive behavior - moves towards target but decelerates when approaching
 */
// // @ccclass('ArriveBehavior')
// // @menu('Steering/Behaviors/Arrive')
export class ArriveBehavior extends SteeringBehavior {
    // // @property(Node)
    public target: Node = null;

    // @property
    public targetPosition: Vec3 = v3(0, 0, 0);

    // @property
    public useTargetNode: boolean = true;

    // // @property({ range: [5, 100] })
    public arrivalRadius: number = 20;

    // // @property({ range: [10, 200] })
    public slowDownRadius: number = 100;

    calculateSteering(): SteeringForce {
        let targetPos: Vec3;
        
        if (this.useTargetNode && this.target) {
            targetPos = this.target.worldPosition;
        } else {
            targetPos = this.targetPosition;
        }

        const distance = Vec3.distance(this.node.worldPosition, targetPos);
        
        // If we're within arrival radius, don't apply force
        if (distance < this.arrivalRadius) {
            return SteeringForce.zero();
        }

        const desired = new Vec3();
        Vec3.subtract(desired, targetPos, this.node.worldPosition);
        desired.normalize();

        // Calculate desired speed based on distance
        let desiredSpeed = this.agent.config.maxSpeed;
        if (distance < this.slowDownRadius) {
            // Linear deceleration
            desiredSpeed = this.agent.config.maxSpeed * (distance / this.slowDownRadius);
        }

        desired.multiplyScalar(desiredSpeed);

        const steer = new Vec3();
        Vec3.subtract(steer, desired, this.agent.velocity);
        
        // Limit the force
        this.limitVector(steer, this.agent.config.maxForce);
        
        return new SteeringForce(steer, this.weight);
    }

    /**
     * Set target position directly
     */
    public setTarget(position: Vec3) {
        this.targetPosition = position.clone();
        this.useTargetNode = false;
    }

    /**
     * Set target node
     */
    public setTargetNode(node: Node) {
        this.target = node;
        this.useTargetNode = true;
    }

    /**
     * Check if we've arrived at the target
     */
    public hasArrived(): boolean {
        let targetPos: Vec3;
        
        if (this.useTargetNode && this.target) {
            targetPos = this.target.worldPosition;
        } else {
            targetPos = this.targetPosition;
        }

        const distance = Vec3.distance(this.node.worldPosition, targetPos);
        return distance < this.arrivalRadius;
    }

    /**
     * Check if we're in the slowdown zone
     */
    public isInSlowdownZone(): boolean {
        let targetPos: Vec3;
        
        if (this.useTargetNode && this.target) {
            targetPos = this.target.worldPosition;
        } else {
            targetPos = this.targetPosition;
        }

        const distance = Vec3.distance(this.node.worldPosition, targetPos);
        return distance < this.slowDownRadius && distance >= this.arrivalRadius;
    }
}