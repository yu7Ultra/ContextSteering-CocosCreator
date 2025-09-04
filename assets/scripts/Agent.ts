import { _decorator, Component, Vec3, Node, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Agent')
export class Agent extends Component {
    @property
    maxSpeed: number = 200;
    
    @property
    maxForce: number = 100;
    
    @property
    radius: number = 20;

    private velocity: Vec3 = v3(0, 0, 0);
    private contextMapSize: number = 16;
    private contextMap: number[] = [];
    private dangerMap: number[] = [];
    
    start() {
        // Initialize arrays
        for (let i = 0; i < this.contextMapSize; i++) {
            this.contextMap.push(0);
            this.dangerMap.push(0);
        }
        
        // Initialize with random velocity
        const angle = Math.random() * Math.PI * 2;
        this.velocity.set(
            Math.cos(angle) * this.maxSpeed * 0.5,
            Math.sin(angle) * this.maxSpeed * 0.5,
            0
        );
    }

    update(deltaTime: number) {
        this.updateContextSteering();
        this.move(deltaTime);
    }

    private updateContextSteering() {
        // Clear context maps
        for (let i = 0; i < this.contextMapSize; i++) {
            this.contextMap[i] = 0;
            this.dangerMap[i] = 0;
        }

        // Add interest towards target (simple forward bias for now)
        for (let i = 0; i < this.contextMapSize; i++) {
            const angle = (i / this.contextMapSize) * Math.PI * 2;
            const dir = v3(Math.cos(angle), Math.sin(angle), 0);
            
            // Simple interest: prefer current movement direction
            const normalizedVel = this.velocity.clone().normalize();
            const dot = Vec3.dot(dir, normalizedVel);
            this.contextMap[i] = Math.max(0, dot);
        }

        // Check for obstacles and add danger
        const obstacles = this.findNearbyObstacles();
        for (const obstacle of obstacles) {
            this.addObstacleDanger(obstacle);
        }

        // Apply danger to reduce interest
        for (let i = 0; i < this.contextMapSize; i++) {
            this.contextMap[i] = Math.max(0, this.contextMap[i] - this.dangerMap[i]);
        }
    }

    private findNearbyObstacles(): Node[] {
        // Find nearby nodes tagged as obstacles
        const obstacles: Node[] = [];
        const scene = this.node.scene;
        
        scene.walk((node: Node) => {
            if (node !== this.node && node.name.includes('Obstacle')) {
                const distance = Vec3.distance(this.node.worldPosition, node.worldPosition);
                if (distance < this.radius * 3) {
                    obstacles.push(node);
                }
            }
        });
        
        return obstacles;
    }

    private addObstacleDanger(obstacle: Node) {
        const toObstacle = new Vec3();
        Vec3.subtract(toObstacle, obstacle.worldPosition, this.node.worldPosition);
        const distance = toObstacle.length();
        
        if (distance < this.radius * 3) {
            toObstacle.normalize();
            
            // Find the context slot this obstacle affects
            const angle = Math.atan2(toObstacle.y, toObstacle.x);
            const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
            const slot = Math.floor((normalizedAngle / (Math.PI * 2)) * this.contextMapSize);
            
            // Add danger with falloff
            const danger = 1 - (distance / (this.radius * 3));
            this.dangerMap[slot] = Math.max(this.dangerMap[slot], danger);
            
            // Spread danger to adjacent slots
            const spread = 2;
            for (let i = 1; i <= spread; i++) {
                const leftSlot = (slot - i + this.contextMapSize) % this.contextMapSize;
                const rightSlot = (slot + i) % this.contextMapSize;
                const spreadDanger = danger * (1 - i / (spread + 1));
                
                this.dangerMap[leftSlot] = Math.max(this.dangerMap[leftSlot], spreadDanger);
                this.dangerMap[rightSlot] = Math.max(this.dangerMap[rightSlot], spreadDanger);
            }
        }
    }

    private move(deltaTime: number) {
        // Find best direction from context map
        let bestDirection = v3(0, 0, 0);
        let maxInterest = 0;
        
        for (let i = 0; i < this.contextMapSize; i++) {
            if (this.contextMap[i] > maxInterest) {
                maxInterest = this.contextMap[i];
                const angle = (i / this.contextMapSize) * Math.PI * 2;
                bestDirection.set(Math.cos(angle), Math.sin(angle), 0);
            }
        }

        if (maxInterest > 0) {
            // Apply steering force towards best direction
            bestDirection.multiplyScalar(this.maxSpeed);
            const steerForce = new Vec3();
            Vec3.subtract(steerForce, bestDirection, this.velocity);
            
            // Limit steering force
            if (steerForce.lengthSqr() > this.maxForce * this.maxForce) {
                steerForce.normalize().multiplyScalar(this.maxForce);
            }
            
            // Apply force
            this.velocity.add(steerForce.multiplyScalar(deltaTime));
        }

        // Limit velocity
        if (this.velocity.lengthSqr() > this.maxSpeed * this.maxSpeed) {
            this.velocity.normalize().multiplyScalar(this.maxSpeed);
        }

        // Update position
        const movement = this.velocity.clone().multiplyScalar(deltaTime);
        this.node.setWorldPosition(this.node.worldPosition.add(movement));

        // Wrap around screen edges (simple boundary handling)
        this.wrapAroundBounds();
    }

    private wrapAroundBounds() {
        const pos = this.node.worldPosition;
        const bounds = { width: 800, height: 600 }; // Adjust based on your screen size
        
        if (pos.x < -bounds.width / 2) pos.x = bounds.width / 2;
        if (pos.x > bounds.width / 2) pos.x = -bounds.width / 2;
        if (pos.y < -bounds.height / 2) pos.y = bounds.height / 2;
        if (pos.y > bounds.height / 2) pos.y = -bounds.height / 2;
        
        this.node.setWorldPosition(pos);
    }
}