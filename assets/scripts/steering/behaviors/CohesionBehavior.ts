import { Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';

const { ccclass, property, menu } = _decorator;

/**
 * Cohesion behavior - move towards the center of nearby agents
 */
@ccclass('CohesionBehavior')
@menu('Steering/Behaviors/Cohesion')
export class CohesionBehavior extends SteeringBehavior {
    @property({ range: [30, 400] })
    public cohesionRadius: number = 100;

    @property({ range: [0.1, 3] })
    public cohesionForceMultiplier: number = 1.0;

    calculateSteering(): SteeringForce {
        const nearbyAgents = this.agent.findNearbyAgents(this.cohesionRadius);
        
        if (nearbyAgents.length === 0) {
            return SteeringForce.zero();
        }

        const centerOfMass = v3(0, 0, 0);
        let count = 0;

        for (const otherAgent of nearbyAgents) {
            const distance = Vec3.distance(this.node.worldPosition, otherAgent.getPosition());
            
            if (distance > 0 && distance < this.cohesionRadius) {
                // Add other agent's position to center of mass calculation
                const otherPosition = otherAgent.getPosition();
                
                // Weight by proximity (closer agents have more influence)
                const weight = 1.0 - (distance / this.cohesionRadius);
                otherPosition.multiplyScalar(weight);
                
                centerOfMass.add(otherPosition);
                count++;
            }
        }

        if (count > 0) {
            // Calculate center of mass
            centerOfMass.multiplyScalar(1.0 / count);
            
            // Seek towards center of mass
            const cohesionForce = this.seek(centerOfMass);
            
            // Apply force multiplier
            cohesionForce.multiplyScalar(this.cohesionForceMultiplier);
            
            // Limit the force
            this.limitVector(cohesionForce, this.agent.config.maxForce);
            
            return new SteeringForce(cohesionForce, this.weight);
        }

        return SteeringForce.zero();
    }

    /**
     * Get the number of nearby agents affecting cohesion
     */
    public getNearbyAgentCount(): number {
        return this.agent.findNearbyAgents(this.cohesionRadius).length;
    }

    /**
     * Check if cohesion is active (has nearby agents)
     */
    public isCohesionActive(): boolean {
        return this.getNearbyAgentCount() > 0;
    }

    /**
     * Get the center of mass of nearby agents
     */
    public getCenterOfMass(): Vec3 {
        const nearbyAgents = this.agent.findNearbyAgents(this.cohesionRadius);
        
        if (nearbyAgents.length === 0) {
            return this.node.worldPosition.clone();
        }

        const centerOfMass = v3(0, 0, 0);
        let count = 0;

        for (const otherAgent of nearbyAgents) {
            const distance = Vec3.distance(this.node.worldPosition, otherAgent.getPosition());
            
            if (distance > 0 && distance < this.cohesionRadius) {
                centerOfMass.add(otherAgent.getPosition());
                count++;
            }
        }

        if (count > 0) {
            centerOfMass.multiplyScalar(1.0 / count);
        }

        return centerOfMass;
    }

    /**
     * Get distance to center of mass
     */
    public getDistanceToCenterOfMass(): number {
        const centerOfMass = this.getCenterOfMass();
        return Vec3.distance(this.node.worldPosition, centerOfMass);
    }

    /**
     * Get cohesion strength based on how centered the agent is
     */
    public getCohesionStrength(): number {
        const distance = this.getDistanceToCenterOfMass();
        
        if (distance >= this.cohesionRadius) {
            return 0;
        }
        
        // Return normalized strength (1 = at center, 0 = at edge)
        return 1.0 - (distance / this.cohesionRadius);
    }
}