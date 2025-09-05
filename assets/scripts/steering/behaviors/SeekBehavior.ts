import { Node, Vec3, v3 } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';

/**
 * Seek behavior - moves the agent towards a target
 */
export class SeekBehavior extends SteeringBehavior {
    public target: Node = null;
    public targetPosition: Vec3 = v3(0, 0, 0);
    public useTargetNode: boolean = true;

    calculateSteering(): SteeringForce {
        let targetPos: Vec3;
        
        if (this.useTargetNode && this.target) {
            targetPos = this.target.worldPosition;
        } else {
            targetPos = this.targetPosition;
        }

        const seekForce = this.seek(targetPos);
        
        // Limit the force
        this.limitVector(seekForce, this.agent.config.maxForce);
        
        return new SteeringForce(seekForce, this.weight);
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
}