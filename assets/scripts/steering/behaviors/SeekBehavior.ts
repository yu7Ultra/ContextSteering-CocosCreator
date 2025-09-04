import { Node, Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';

const { ccclass, property, menu } = _decorator;

/**
 * Seek behavior - moves the agent towards a target
 */
@ccclass('SeekBehavior')
@menu('Steering/Behaviors/Seek')
export class SeekBehavior extends SteeringBehavior {
    @property(Node)
    public target: Node = null;

    @property
    public targetPosition: Vec3 = v3(0, 0, 0);

    @property
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