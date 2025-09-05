import { Component, Node, Vec3, v3 } from '../../cc-mock';
import { SteeringForce } from './SteeringForce';
import { SteeringConfig, DEFAULT_STEERING_CONFIG } from './SteeringConfig';
import { ISteeringAgent } from './SteeringBehavior';


/**
 * Main steering agent that combines multiple steering behaviors
 */
// // @ccclass('SteeringAgent')
// // @menu('Steering/Steering Agent')
export class SteeringAgent extends Component implements ISteeringAgent {
    // // @property({ range: [0, 500] })
    public maxSpeed: number = DEFAULT_STEERING_CONFIG.maxSpeed;

    // // @property({ range: [0, 200] })
    public maxForce: number = DEFAULT_STEERING_CONFIG.maxForce;

    // // @property({ range: [0.1, 5] })
    public mass: number = DEFAULT_STEERING_CONFIG.mass;

    // // @property({ range: [5, 50] })
    public radius: number = 20;

    // @property
    public showDebugInfo: boolean = false;

    // Public velocity for access by behaviors
    public velocity: Vec3 = v3(0, 0, 0);

    // Configuration object
    public config: SteeringConfig;

    private behaviors: any[] = []; // Using any to avoid circular dependency
    private debugLines: { from: Vec3, to: Vec3, color: string }[] = [];

    start() {
        // Initialize configuration
        this.updateConfig();

        // Get all steering behaviors on this node
        this.behaviors = this.node.getComponents('SteeringBehavior') || [];

        // Initialize with random velocity if no initial velocity
        if (this.velocity.lengthSqr() === 0) {
            const angle = Math.random() * Math.PI * 2;
            this.velocity.set(
                Math.cos(angle) * this.maxSpeed * 0.5,
                Math.sin(angle) * this.maxSpeed * 0.5,
                0
            );
        }
    }

    update(deltaTime: number) {
        this.updateConfig();
        this.updateSteering(deltaTime);
        this.updateMovement(deltaTime);
        
        if (this.showDebugInfo) {
            this.drawDebugInfo();
        }
    }

    private updateConfig() {
        this.config = {
            ...DEFAULT_STEERING_CONFIG,
            maxSpeed: this.maxSpeed,
            maxForce: this.maxForce,
            mass: this.mass
        };
    }

    private updateSteering(deltaTime: number) {
        // Clear debug info
        this.debugLines = [];

        // Combine all active steering forces
        const totalForce = v3(0, 0, 0);
        
        for (const behavior of this.behaviors) {
            if (behavior.enabled) {
                const steeringForce = behavior.getWeightedSteering();
                const weightedForce = steeringForce.getWeightedForce();
                totalForce.add(weightedForce);

                // Add debug line
                if (this.showDebugInfo && weightedForce.lengthSqr() > 0) {
                    this.debugLines.push({
                        from: this.node.worldPosition.clone(),
                        to: this.node.worldPosition.clone().add(weightedForce.clone().multiplyScalar(2)),
                        color: this.getDebugColorForBehavior(behavior)
                    });
                }
            }
        }

        // Limit total steering force
        if (totalForce.lengthSqr() > this.maxForce * this.maxForce) {
            totalForce.normalize().multiplyScalar(this.maxForce);
        }

        // Apply force to velocity (F = ma, so a = F/m)
        const acceleration = totalForce.clone().multiplyScalar(1 / this.mass);
        this.velocity.add(acceleration.multiplyScalar(deltaTime));

        // Limit velocity to max speed
        if (this.velocity.lengthSqr() > this.maxSpeed * this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }
    }

    private updateMovement(deltaTime: number) {
        // Update position based on velocity
        const movement = this.velocity.clone().multiplyScalar(deltaTime);
        const newPosition = this.node.worldPosition.clone().add(movement);
        this.node.setWorldPosition(newPosition);

        // Simple boundary wrapping (can be overridden by wall following behavior)
        this.wrapAroundBounds();
    }

    private wrapAroundBounds() {
        const pos = this.node.worldPosition;
        const bounds = { width: 800, height: 600 };
        
        let wrapped = false;
        if (pos.x < -bounds.width / 2) { pos.x = bounds.width / 2; wrapped = true; }
        if (pos.x > bounds.width / 2) { pos.x = -bounds.width / 2; wrapped = true; }
        if (pos.y < -bounds.height / 2) { pos.y = bounds.height / 2; wrapped = true; }
        if (pos.y > bounds.height / 2) { pos.y = -bounds.height / 2; wrapped = true; }
        
        if (wrapped) {
            this.node.setWorldPosition(pos);
        }
    }

    private getDebugColorForBehavior(behavior: any): string {
        const className = behavior.constructor.name;
        const colors = {
            'SeekBehavior': '#00ff00',
            'FleeBehavior': '#ff0000', 
            'ArriveBehavior': '#00ffff',
            'PursueBehavior': '#ffff00',
            'EvadeBehavior': '#ff8800',
            'SeparationBehavior': '#ff00ff',
            'AlignmentBehavior': '#8800ff',
            'CohesionBehavior': '#00ff88',
            'ObstacleAvoidanceBehavior': '#ff4444',
            'WallFollowingBehavior': '#4444ff',
            'PathFollowingBehavior': '#88ff88'
        };
        return colors[className] || '#ffffff';
    }

    private drawDebugInfo() {
        // This would be implemented with actual graphics in Cocos Creator
        // For now, just log debug information
        if (this.debugLines.length > 0) {
            console.log(`Agent ${this.node.name} forces:`, this.debugLines.length);
        }
    }

    /**
     * Find all agents within the specified radius
     */
    public findNearbyAgents(radius: number): SteeringAgent[] {
        const nearbyAgents: SteeringAgent[] = [];
        const scene = this.node.scene;
        
        if (!scene) return nearbyAgents;

        scene.walk((node: Node) => {
            if (node === this.node) return;
            
            const agent = node.getComponent('SteeringAgent') as SteeringAgent;
            if (agent) {
                const distance = Vec3.distance(this.node.worldPosition, node.worldPosition);
                if (distance <= radius) {
                    nearbyAgents.push(agent);
                }
            }
        });

        return nearbyAgents;
    }

    /**
     * Find all obstacles within the specified radius
     */
    public findNearbyObstacles(radius: number): Node[] {
        const obstacles: Node[] = [];
        const scene = this.node.scene;
        
        if (!scene) return obstacles;

        scene.walk((node: Node) => {
            if (node !== this.node && node.name.includes('Obstacle')) {
                const distance = Vec3.distance(this.node.worldPosition, node.worldPosition);
                if (distance <= radius) {
                    obstacles.push(node);
                }
            }
        });
        
        return obstacles;
    }

    /**
     * Get the agent's heading direction
     */
    public getHeading(): Vec3 {
        if (this.velocity.lengthSqr() > 0) {
            return this.velocity.clone().normalize();
        }
        return v3(1, 0, 0); // Default heading
    }

    /**
     * Get the agent's position
     */
    public getPosition(): Vec3 {
        return this.node.worldPosition.clone();
    }

    /**
     * Set the agent's position
     */
    public setPosition(position: Vec3) {
        this.node.setWorldPosition(position);
    }

    /**
     * Get the agent's velocity
     */
    public getVelocity(): Vec3 {
        return this.velocity.clone();
    }

    /**
     * Set the agent's velocity
     */
    public setVelocity(velocity: Vec3) {
        this.velocity = velocity.clone();
    }
}