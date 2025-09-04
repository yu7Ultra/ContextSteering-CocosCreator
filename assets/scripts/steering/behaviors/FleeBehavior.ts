import { Node, Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';

const { ccclass, property, menu } = _decorator;

/**
 * Flee behavior - moves the agent away from a target
 */
@ccclass('FleeBehavior')
@menu('Steering/Behaviors/Flee')
export class FleeBehavior extends SteeringBehavior {
    @property(Node)
    public target: Node = null;

    @property
    public targetPosition: Vec3 = v3(0, 0, 0);

    @property
    public useTargetNode: boolean = true;

    @property({ range: [0, 500] })
    public fleeRadius: number = 200;

    calculateSteering(): SteeringForce {
        let targetPos: Vec3;
        
        if (this.useTargetNode && this.target) {
            targetPos = this.target.worldPosition;
        } else {
            targetPos = this.targetPosition;
        }

        // Only flee if within flee radius
        const distance = Vec3.distance(this.node.worldPosition, targetPos);
        if (distance > this.fleeRadius) {
            return SteeringForce.zero();
        }

        const fleeForce = this.flee(targetPos);
        
        // Apply distance falloff - stronger force when closer
        const distanceFactor = 1 - (distance / this.fleeRadius);
        fleeForce.multiplyScalar(distanceFactor);
        
        // Limit the force
        this.limitVector(fleeForce, this.agent.config.maxForce);
        
        return new SteeringForce(fleeForce, this.weight);
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
     * Check if target is within flee radius
     */
    public isTargetInRange(): boolean {
        let targetPos: Vec3;
        
        if (this.useTargetNode && this.target) {
            targetPos = this.target.worldPosition;
        } else {
            targetPos = this.targetPosition;
        }

        const distance = Vec3.distance(this.node.worldPosition, targetPos);
        return distance <= this.fleeRadius;
    }
}