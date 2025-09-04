import { Node, Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';
import { SteeringAgent } from '../core/SteeringAgent';

const { ccclass, property, menu } = _decorator;

/**
 * Evade behavior - predicts pursuer movement and escapes
 */
@ccclass('EvadeBehavior')
@menu('Steering/Behaviors/Evade')
export class EvadeBehavior extends SteeringBehavior {
    @property(Node)
    public threat: Node = null;

    @property({ range: [0, 2] })
    public predictionTime: number = 1.0;

    @property
    public maxPredictionTime: number = 2.0;

    @property({ range: [0, 500] })
    public panicRadius: number = 200;

    calculateSteering(): SteeringForce {
        if (!this.threat) {
            return SteeringForce.zero();
        }

        // Check if threat is within panic radius
        const distance = Vec3.distance(this.node.worldPosition, this.threat.worldPosition);
        if (distance > this.panicRadius) {
            return SteeringForce.zero();
        }

        const threatAgent = this.threat.getComponent(SteeringAgent);
        if (!threatAgent) {
            // If threat has no agent, just flee from its position
            return new SteeringForce(this.flee(this.threat.worldPosition), this.weight);
        }

        // Calculate distance and relative heading
        const toThreat = new Vec3();
        Vec3.subtract(toThreat, this.threat.worldPosition, this.node.worldPosition);

        // Calculate relative heading (dot product of normalized velocities)
        const relativeHeading = Vec3.dot(
            this.agent.velocity.clone().normalize(),
            threatAgent.velocity.clone().normalize()
        );

        // If threat is behind and not facing us, no need to evade
        if (Vec3.dot(toThreat, this.agent.getHeading()) < 0 && relativeHeading > -0.95) {
            return SteeringForce.zero();
        }

        // Calculate prediction time based on distance and relative speed
        let lookAheadTime = distance / (this.agent.config.maxSpeed + threatAgent.velocity.length());
        lookAheadTime = Math.min(lookAheadTime, this.maxPredictionTime);

        // Predict threat's future position
        const futureThreatPosition = this.threat.worldPosition.clone()
            .add(threatAgent.velocity.clone().multiplyScalar(lookAheadTime));

        // Flee from predicted position
        const evadeForce = this.flee(futureThreatPosition);
        
        // Apply panic factor - stronger evasion when closer
        const panicFactor = 1 - (distance / this.panicRadius);
        evadeForce.multiplyScalar(1 + panicFactor);
        
        // Limit the force
        this.limitVector(evadeForce, this.agent.config.maxForce);
        
        return new SteeringForce(evadeForce, this.weight);
    }

    /**
     * Set the threat to evade from
     */
    public setThreat(threat: Node) {
        this.threat = threat;
    }

    /**
     * Check if threat is in panic radius
     */
    public isThreatNear(): boolean {
        if (!this.threat) {
            return false;
        }

        const distance = Vec3.distance(this.node.worldPosition, this.threat.worldPosition);
        return distance <= this.panicRadius;
    }

    /**
     * Get the predicted threat position
     */
    public getPredictedThreatPosition(): Vec3 {
        if (!this.threat) {
            return v3(0, 0, 0);
        }

        const threatAgent = this.threat.getComponent(SteeringAgent);
        if (!threatAgent) {
            return this.threat.worldPosition.clone();
        }

        const toThreat = new Vec3();
        Vec3.subtract(toThreat, this.threat.worldPosition, this.node.worldPosition);
        const distance = toThreat.length();

        let lookAheadTime = distance / (this.agent.config.maxSpeed + threatAgent.velocity.length());
        lookAheadTime = Math.min(lookAheadTime, this.maxPredictionTime);

        return this.threat.worldPosition.clone()
            .add(threatAgent.velocity.clone().multiplyScalar(lookAheadTime));
    }
}