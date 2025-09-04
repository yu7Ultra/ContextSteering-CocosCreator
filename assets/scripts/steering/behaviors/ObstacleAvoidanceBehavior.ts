import { Node, Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';

const { ccclass, property, menu } = _decorator;

/**
 * Obstacle Avoidance behavior - navigate around static obstacles
 */
@ccclass('ObstacleAvoidanceBehavior')
@menu('Steering/Behaviors/Obstacle Avoidance')
export class ObstacleAvoidanceBehavior extends SteeringBehavior {
    @property({ range: [50, 300] })
    public avoidanceDistance: number = 150;

    @property({ range: [20, 150] })
    public maxSeeAhead: number = 100;

    @property({ range: [0.1, 5] })
    public avoidanceForceMultiplier: number = 2.0;

    calculateSteering(): SteeringForce {
        const obstacles = this.agent.findNearbyObstacles(this.avoidanceDistance);
        
        if (obstacles.length === 0) {
            return SteeringForce.zero();
        }

        // Calculate look-ahead distance based on velocity
        const velocity = this.agent.getVelocity();
        const speed = velocity.length();
        const lookAhead = (speed / this.agent.config.maxSpeed) * this.maxSeeAhead;

        // Calculate ahead point
        const ahead = this.node.worldPosition.clone();
        if (speed > 0) {
            const heading = velocity.clone().normalize();
            ahead.add(heading.multiplyScalar(lookAhead));
        }

        // Calculate ahead2 point (half distance)
        const ahead2 = this.node.worldPosition.clone();
        if (speed > 0) {
            const heading = velocity.clone().normalize();
            ahead2.add(heading.multiplyScalar(lookAhead * 0.5));
        }

        let mostThreateningObstacle: Node = null;
        let minDistance = Infinity;

        // Find most threatening obstacle
        for (const obstacle of obstacles) {
            const obstaclePos = obstacle.worldPosition;
            const obstacleRadius = this.getObstacleRadius(obstacle);

            // Check collision with ahead points
            const distance1 = Vec3.distance(obstaclePos, ahead);
            const distance2 = Vec3.distance(obstaclePos, ahead2);
            const distance3 = Vec3.distance(obstaclePos, this.node.worldPosition);

            const minObstacleDistance = Math.min(distance1, distance2, distance3);

            if (minObstacleDistance <= obstacleRadius + this.agent.radius) {
                if (minObstacleDistance < minDistance) {
                    minDistance = minObstacleDistance;
                    mostThreateningObstacle = obstacle;
                }
            }
        }

        let avoidanceForce = v3(0, 0, 0);

        if (mostThreateningObstacle) {
            // Calculate avoidance force
            const obstaclePos = mostThreateningObstacle.worldPosition;
            const obstacleRadius = this.getObstacleRadius(mostThreateningObstacle);

            // Calculate lateral force (perpendicular to velocity)
            const toObstacle = new Vec3();
            Vec3.subtract(toObstacle, obstaclePos, this.node.worldPosition);
            
            const heading = this.agent.getHeading();
            
            // Calculate perpendicular vector (lateral avoidance)
            const lateral = new Vec3(-heading.y, heading.x, 0);
            
            // Determine which side to avoid towards
            const dot = Vec3.dot(toObstacle, lateral);
            if (dot < 0) {
                lateral.multiplyScalar(-1);
            }

            // Calculate avoidance strength based on distance
            const totalRadius = obstacleRadius + this.agent.radius;
            const distance = Vec3.distance(this.node.worldPosition, obstaclePos);
            const avoidanceStrength = Math.max(0, (totalRadius + 50 - distance) / (totalRadius + 50));

            avoidanceForce = lateral.multiplyScalar(this.agent.config.maxSpeed * avoidanceStrength);
            avoidanceForce.multiplyScalar(this.avoidanceForceMultiplier);

            // Also add some backward force if very close
            if (distance < totalRadius + 20) {
                const backward = heading.clone().multiplyScalar(-this.agent.config.maxSpeed * 0.5);
                avoidanceForce.add(backward);
            }
        }

        // Limit the force
        this.limitVector(avoidanceForce, this.agent.config.maxForce);

        return new SteeringForce(avoidanceForce, this.weight);
    }

    /**
     * Get obstacle radius (estimate based on node or default)
     */
    private getObstacleRadius(obstacle: Node): number {
        // In a real implementation, this would get the actual collision radius
        // For now, estimate based on name or default
        return 25; // Default obstacle radius
    }

    /**
     * Get the most threatening obstacle
     */
    public getMostThreateningObstacle(): Node | null {
        const obstacles = this.agent.findNearbyObstacles(this.avoidanceDistance);
        
        if (obstacles.length === 0) {
            return null;
        }

        const velocity = this.agent.getVelocity();
        const speed = velocity.length();
        const lookAhead = (speed / this.agent.config.maxSpeed) * this.maxSeeAhead;

        const ahead = this.node.worldPosition.clone();
        if (speed > 0) {
            const heading = velocity.clone().normalize();
            ahead.add(heading.multiplyScalar(lookAhead));
        }

        let mostThreateningObstacle: Node = null;
        let minDistance = Infinity;

        for (const obstacle of obstacles) {
            const obstaclePos = obstacle.worldPosition;
            const obstacleRadius = this.getObstacleRadius(obstacle);
            const distance = Vec3.distance(obstaclePos, ahead);

            if (distance <= obstacleRadius + this.agent.radius && distance < minDistance) {
                minDistance = distance;
                mostThreateningObstacle = obstacle;
            }
        }

        return mostThreateningObstacle;
    }

    /**
     * Check if obstacle avoidance is currently active
     */
    public isAvoidingObstacle(): boolean {
        return this.getMostThreateningObstacle() !== null;
    }

    /**
     * Get the ahead point for visualization
     */
    public getAheadPoint(): Vec3 {
        const velocity = this.agent.getVelocity();
        const speed = velocity.length();
        const lookAhead = (speed / this.agent.config.maxSpeed) * this.maxSeeAhead;

        const ahead = this.node.worldPosition.clone();
        if (speed > 0) {
            const heading = velocity.clone().normalize();
            ahead.add(heading.multiplyScalar(lookAhead));
        }

        return ahead;
    }
}