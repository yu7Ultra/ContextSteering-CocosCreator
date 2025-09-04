import { Node, Vec3, v3 } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';
import { SteeringAgent } from '../core/SteeringAgent';


/**
 * Pursue behavior - predicts target movement and intercepts
 */
// // @ccclass('PursueBehavior')
// // @menu('Steering/Behaviors/Pursue')
export class PursueBehavior extends SteeringBehavior {
    // // @property(Node)
    public target: Node = null;

    // // @property({ range: [0, 2] })
    public predictionTime: number = 1.0;

    // @property
    public maxPredictionTime: number = 2.0;

    calculateSteering(): SteeringForce {
        if (!this.target) {
            return SteeringForce.zero();
        }

        const targetAgent = this.target.getComponent(SteeringAgent);
        if (!targetAgent) {
            // If target has no agent, just seek to its position
            return new SteeringForce(this.seek(this.target.worldPosition), this.weight);
        }

        // Calculate distance and relative heading
        const toTarget = new Vec3();
        Vec3.subtract(toTarget, this.target.worldPosition, this.node.worldPosition);
        const distance = toTarget.length();

        // Calculate relative heading (dot product of normalized velocities)
        const relativeHeading = Vec3.dot(
            this.agent.velocity.clone().normalize(),
            targetAgent.velocity.clone().normalize()
        );

        // If target is ahead and facing roughly same direction, just seek
        if (Vec3.dot(toTarget, this.agent.getHeading()) > 0 && relativeHeading < -0.95) {
            return new SteeringForce(this.seek(this.target.worldPosition), this.weight);
        }

        // Calculate prediction time based on distance and relative speed
        let lookAheadTime = distance / (this.agent.config.maxSpeed + targetAgent.velocity.length());
        lookAheadTime = Math.min(lookAheadTime, this.maxPredictionTime);

        // Predict target's future position
        const futurePosition = this.target.worldPosition.clone()
            .add(targetAgent.velocity.clone().multiplyScalar(lookAheadTime));

        // Seek to predicted position
        const pursueForce = this.seek(futurePosition);
        
        // Limit the force
        this.limitVector(pursueForce, this.agent.config.maxForce);
        
        return new SteeringForce(pursueForce, this.weight);
    }

    /**
     * Set the target to pursue
     */
    public setTarget(target: Node) {
        this.target = target;
    }

    /**
     * Get the predicted target position
     */
    public getPredictedPosition(): Vec3 {
        if (!this.target) {
            return v3(0, 0, 0);
        }

        const targetAgent = this.target.getComponent(SteeringAgent);
        if (!targetAgent) {
            return this.target.worldPosition.clone();
        }

        const toTarget = new Vec3();
        Vec3.subtract(toTarget, this.target.worldPosition, this.node.worldPosition);
        const distance = toTarget.length();

        let lookAheadTime = distance / (this.agent.config.maxSpeed + targetAgent.velocity.length());
        lookAheadTime = Math.min(lookAheadTime, this.maxPredictionTime);

        return this.target.worldPosition.clone()
            .add(targetAgent.velocity.clone().multiplyScalar(lookAheadTime));
    }
}