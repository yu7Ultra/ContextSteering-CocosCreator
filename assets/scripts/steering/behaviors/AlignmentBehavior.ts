import { Vec3, v3 } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';


/**
 * Alignment behavior - align movement with nearby agents
 */
// // @ccclass('AlignmentBehavior')
// // @menu('Steering/Behaviors/Alignment')
export class AlignmentBehavior extends SteeringBehavior {
    // // @property({ range: [20, 300] })
    public alignmentRadius: number = 80;

    // // @property({ range: [0.1, 3] })
    public alignmentForceMultiplier: number = 1.0;

    calculateSteering(): SteeringForce {
        const nearbyAgents = this.agent.findNearbyAgents(this.alignmentRadius);
        
        if (nearbyAgents.length === 0) {
            return SteeringForce.zero();
        }

        const averageVelocity = v3(0, 0, 0);
        let count = 0;

        for (const otherAgent of nearbyAgents) {
            const distance = Vec3.distance(this.node.worldPosition, otherAgent.getPosition());
            
            if (distance > 0 && distance < this.alignmentRadius) {
                // Add other agent's velocity to average
                const otherVelocity = otherAgent.getVelocity();
                
                // Weight by proximity (closer agents have more influence)
                const weight = 1.0 - (distance / this.alignmentRadius);
                otherVelocity.multiplyScalar(weight);
                
                averageVelocity.add(otherVelocity);
                count++;
            }
        }

        if (count > 0) {
            // Calculate average velocity
            averageVelocity.multiplyScalar(1.0 / count);
            
            // Normalize and scale to desired speed
            if (averageVelocity.lengthSqr() > 0) {
                averageVelocity.normalize().multiplyScalar(this.agent.config.maxSpeed);
                
                // Calculate steering force
                const steer = new Vec3();
                Vec3.subtract(steer, averageVelocity, this.agent.velocity);
                
                // Apply force multiplier
                steer.multiplyScalar(this.alignmentForceMultiplier);
                
                // Limit the force
                this.limitVector(steer, this.agent.config.maxForce);
                
                return new SteeringForce(steer, this.weight);
            }
        }

        return SteeringForce.zero();
    }

    /**
     * Get the number of nearby agents affecting alignment
     */
    public getNearbyAgentCount(): number {
        return this.agent.findNearbyAgents(this.alignmentRadius).length;
    }

    /**
     * Check if alignment is active (has nearby agents)
     */
    public isAlignmentActive(): boolean {
        return this.getNearbyAgentCount() > 0;
    }

    /**
     * Get the average velocity direction of nearby agents
     */
    public getAverageVelocityDirection(): Vec3 {
        const nearbyAgents = this.agent.findNearbyAgents(this.alignmentRadius);
        
        if (nearbyAgents.length === 0) {
            return this.agent.getHeading();
        }

        const averageVelocity = v3(0, 0, 0);
        let count = 0;

        for (const otherAgent of nearbyAgents) {
            const distance = Vec3.distance(this.node.worldPosition, otherAgent.getPosition());
            
            if (distance > 0 && distance < this.alignmentRadius) {
                averageVelocity.add(otherAgent.getVelocity());
                count++;
            }
        }

        if (count > 0) {
            averageVelocity.multiplyScalar(1.0 / count);
            if (averageVelocity.lengthSqr() > 0) {
                return averageVelocity.normalize();
            }
        }

        return this.agent.getHeading();
    }

    /**
     * Get alignment strength based on velocity similarity
     */
    public getAlignmentStrength(): number {
        const averageDirection = this.getAverageVelocityDirection();
        const myDirection = this.agent.getHeading();
        
        // Return dot product as alignment strength (-1 to 1)
        return Vec3.dot(myDirection, averageDirection);
    }
}