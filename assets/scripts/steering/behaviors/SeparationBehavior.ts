import { Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';

const { ccclass, property, menu } = _decorator;

/**
 * Separation behavior - avoid crowding nearby agents
 */
@ccclass('SeparationBehavior')
@menu('Steering/Behaviors/Separation')
export class SeparationBehavior extends SteeringBehavior {
    @property({ range: [10, 200] })
    public separationRadius: number = 50;

    @property({ range: [0.1, 5] })
    public separationForceMultiplier: number = 1.0;

    calculateSteering(): SteeringForce {
        const nearbyAgents = this.agent.findNearbyAgents(this.separationRadius);
        
        if (nearbyAgents.length === 0) {
            return SteeringForce.zero();
        }

        const separationForce = v3(0, 0, 0);
        let count = 0;

        for (const otherAgent of nearbyAgents) {
            const distance = Vec3.distance(this.node.worldPosition, otherAgent.getPosition());
            
            if (distance > 0 && distance < this.separationRadius) {
                // Calculate separation direction (away from other agent)
                const diff = new Vec3();
                Vec3.subtract(diff, this.node.worldPosition, otherAgent.getPosition());
                
                // Weight by distance (closer agents have stronger repulsion)
                diff.normalize();
                const weight = 1.0 / distance; // Inverse distance weighting
                diff.multiplyScalar(weight);
                
                separationForce.add(diff);
                count++;
            }
        }

        if (count > 0) {
            // Average the separation vectors
            separationForce.multiplyScalar(1.0 / count);
            
            // Normalize and scale to desired speed
            separationForce.normalize().multiplyScalar(this.agent.config.maxSpeed);
            
            // Calculate steering force
            const steer = new Vec3();
            Vec3.subtract(steer, separationForce, this.agent.velocity);
            
            // Apply force multiplier
            steer.multiplyScalar(this.separationForceMultiplier);
            
            // Limit the force
            this.limitVector(steer, this.agent.config.maxForce);
            
            return new SteeringForce(steer, this.weight);
        }

        return SteeringForce.zero();
    }

    /**
     * Get the number of nearby agents affecting separation
     */
    public getNearbyAgentCount(): number {
        return this.agent.findNearbyAgents(this.separationRadius).length;
    }

    /**
     * Check if separation is active (has nearby agents)
     */
    public isSeparationActive(): boolean {
        return this.getNearbyAgentCount() > 0;
    }

    /**
     * Get the average separation force magnitude
     */
    public getAverageSeparationDistance(): number {
        const nearbyAgents = this.agent.findNearbyAgents(this.separationRadius);
        
        if (nearbyAgents.length === 0) {
            return this.separationRadius;
        }

        let totalDistance = 0;
        for (const otherAgent of nearbyAgents) {
            totalDistance += Vec3.distance(this.node.worldPosition, otherAgent.getPosition());
        }

        return totalDistance / nearbyAgents.length;
    }
}