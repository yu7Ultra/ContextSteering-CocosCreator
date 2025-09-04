import { Component, Node, Prefab, instantiate, Vec3, v3, Color, Graphics, UITransform } from './cc-mock';
import { SteeringAgent } from './steering/core/SteeringAgent';
import { SeekBehavior } from './steering/behaviors/SeekBehavior';
import { FleeBehavior } from './steering/behaviors/FleeBehavior';
import { FlockBehavior } from './steering/behaviors/FlockBehavior';
import { ObstacleAvoidanceBehavior } from './steering/behaviors/ObstacleAvoidanceBehavior';

export class ModernSteeringManager extends Component {
    public agentPrefab: Prefab | null = null;
    public numberOfAgents: number = 8;
    public numberOfObstacles: number = 4;

    private agents: Node[] = [];
    private obstacles: Node[] = [];
    private mouseTarget: Node | null = null;

    start() {
        this.createMouseTarget();
        this.createObstacles();
        this.createAgents();
    }

    private createMouseTarget() {
        this.mouseTarget = new Node('MouseTarget');
        
        // Create visual representation
        const graphics = this.mouseTarget.addComponent(Graphics);
        graphics.fillColor = Color.WHITE;
        graphics.circle(0, 0, 8);
        graphics.fill();
        
        // Add outline
        graphics.strokeColor = new Color(255, 255, 255, 128);
        graphics.lineWidth = 2;
        graphics.circle(0, 0, 12);
        graphics.stroke();
        
        const uiTransform = this.mouseTarget.addComponent(UITransform);
        uiTransform.setContentSize(24, 24);
        
        this.mouseTarget.setWorldPosition(v3(0, 0, 0));
        this.node.addChild(this.mouseTarget);
    }

    private createAgents() {
        for (let i = 0; i < this.numberOfAgents; i++) {
            const agentNode = this.createModernAgentNode(i);
            
            // Position randomly
            const x = (Math.random() - 0.5) * 500;
            const y = (Math.random() - 0.5) * 300;
            agentNode.setWorldPosition(v3(x, y, 0));
            
            this.node.addChild(agentNode);
            this.agents.push(agentNode);
        }
    }

    private createModernAgentNode(index: number): Node {
        const agentNode = new Node(`ModernAgent${index}`);
        
        // Add SteeringAgent component
        const steeringAgent = agentNode.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 120 + Math.random() * 80;
        steeringAgent.maxForce = 80 + Math.random() * 40;
        steeringAgent.radius = 12 + Math.random() * 8;
        steeringAgent.showDebugInfo = true;

        // Add different behavior combinations for variety
        this.setupAgentBehaviors(agentNode, index);

        // Create visual representation
        const graphics = agentNode.addComponent(Graphics);
        const colors = [
            new Color(100, 200, 255, 255), // Blue
            new Color(255, 150, 100, 255), // Orange
            new Color(150, 255, 150, 255), // Green
            new Color(255, 150, 255, 255), // Pink
            new Color(255, 255, 100, 255), // Yellow
            new Color(150, 150, 255, 255), // Purple
            new Color(255, 200, 150, 255), // Peach
            new Color(200, 255, 200, 255), // Light Green
        ];
        
        graphics.fillColor = colors[index % colors.length];
        graphics.circle(0, 0, steeringAgent.radius);
        graphics.fill();
        
        // Add a direction indicator
        graphics.strokeColor = Color.WHITE;
        graphics.lineWidth = 2;
        graphics.moveTo(0, 0);
        graphics.lineTo(steeringAgent.radius * 1.5, 0);
        graphics.stroke();
        
        const uiTransform = agentNode.addComponent(UITransform);
        uiTransform.setContentSize(steeringAgent.radius * 2, steeringAgent.radius * 2);
        
        return agentNode;
    }

    private setupAgentBehaviors(agentNode: Node, index: number) {
        const behaviorType = index % 4; // 4 different behavior setups

        switch (behaviorType) {
            case 0: // Seeker + Flocking
                {
                    const seekBehavior = agentNode.addComponent(SeekBehavior) as SeekBehavior;
                    seekBehavior.target = this.mouseTarget;
                    seekBehavior.weight = 0.8;

                    const flockBehavior = agentNode.addComponent(FlockBehavior) as FlockBehavior;
                    flockBehavior.weight = 1.2;
                    flockBehavior.separationWeight = 2.0;
                    flockBehavior.alignmentWeight = 1.0;
                    flockBehavior.cohesionWeight = 0.8;

                    const obstacleBehavior = agentNode.addComponent(ObstacleAvoidanceBehavior) as ObstacleAvoidanceBehavior;
                    obstacleBehavior.weight = 3.0;
                }
                break;

            case 1: // Fleer + Flocking
                {
                    const fleeBehavior = agentNode.addComponent(FleeBehavior) as FleeBehavior;
                    fleeBehavior.target = this.mouseTarget;
                    fleeBehavior.fleeRadius = 150;
                    fleeBehavior.weight = 1.5;

                    const flockBehavior = agentNode.addComponent(FlockBehavior) as FlockBehavior;
                    flockBehavior.weight = 1.0;
                    flockBehavior.separationWeight = 1.5;
                    flockBehavior.alignmentWeight = 1.2;
                    flockBehavior.cohesionWeight = 1.0;

                    const obstacleBehavior = agentNode.addComponent(ObstacleAvoidanceBehavior) as ObstacleAvoidanceBehavior;
                    obstacleBehavior.weight = 2.5;
                }
                break;

            case 2: // Pure Flocking
                {
                    const flockBehavior = agentNode.addComponent(FlockBehavior) as FlockBehavior;
                    flockBehavior.weight = 2.0;
                    flockBehavior.separationWeight = 2.5;
                    flockBehavior.alignmentWeight = 1.5;
                    flockBehavior.cohesionWeight = 1.2;

                    const obstacleBehavior = agentNode.addComponent(ObstacleAvoidanceBehavior) as ObstacleAvoidanceBehavior;
                    obstacleBehavior.weight = 3.0;
                }
                break;

            case 3: // Mixed behaviors
                {
                    const seekBehavior = agentNode.addComponent(SeekBehavior) as SeekBehavior;
                    seekBehavior.target = this.mouseTarget;
                    seekBehavior.weight = 0.5;

                    const fleeBehavior = agentNode.addComponent(FleeBehavior) as FleeBehavior;
                    fleeBehavior.target = this.mouseTarget;
                    fleeBehavior.fleeRadius = 80;
                    fleeBehavior.weight = 1.8;

                    const flockBehavior = agentNode.addComponent(FlockBehavior) as FlockBehavior;
                    flockBehavior.weight = 1.0;

                    const obstacleBehavior = agentNode.addComponent(ObstacleAvoidanceBehavior) as ObstacleAvoidanceBehavior;
                    obstacleBehavior.weight = 2.8;
                }
                break;
        }
    }

    private createObstacles() {
        for (let i = 0; i < this.numberOfObstacles; i++) {
            const obstacleNode = this.createObstacleNode(i);
            
            // Position strategically
            const angle = (i / this.numberOfObstacles) * Math.PI * 2;
            const distance = 120 + Math.random() * 80;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            obstacleNode.setWorldPosition(v3(x, y, 0));
            this.node.addChild(obstacleNode);
            this.obstacles.push(obstacleNode);
        }
    }

    private createObstacleNode(index: number): Node {
        const obstacleNode = new Node(`Obstacle${index}`);
        
        const graphics = obstacleNode.addComponent(Graphics);
        graphics.fillColor = Color.RED;
        
        const size = 25 + Math.random() * 30;
        
        // Create different shapes for variety
        if (Math.random() > 0.5) {
            graphics.circle(0, 0, size / 2);
        } else {
            graphics.rect(-size / 2, -size / 2, size, size);
        }
        
        graphics.fill();
        
        // Add border
        graphics.strokeColor = new Color(150, 0, 0, 255);
        graphics.lineWidth = 2;
        graphics.stroke();
        
        const uiTransform = obstacleNode.addComponent(UITransform);
        uiTransform.setContentSize(size, size);
        
        return obstacleNode;
    }

    update(deltaTime: number) {
        // Update mouse target position (simulate mouse movement)
        const time = Date.now() * 0.001;
        if (this.mouseTarget) {
            this.mouseTarget.setWorldPosition(v3(
                Math.cos(time * 0.5) * 100,
                Math.sin(time * 0.3) * 80,
                0
            ));
        }

        // Update agent direction indicators
        for (const agentNode of this.agents) {
            const steeringAgent = agentNode.getComponent(SteeringAgent) as SteeringAgent;
            if (steeringAgent) {
                const vel = steeringAgent.getVelocity();
                if (vel.lengthSqr() > 0) {
                    const angle = Math.atan2(vel.y, vel.x);
                    agentNode.angle = -angle * 180 / Math.PI;
                }
            }
        }
    }

    /**
     * Add a new agent at random position
     */
    public addAgent() {
        const agentNode = this.createModernAgentNode(this.agents.length);
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 300;
        agentNode.setWorldPosition(v3(x, y, 0));
        
        this.node.addChild(agentNode);
        this.agents.push(agentNode);
    }

    /**
     * Add a new obstacle at random position
     */
    public addObstacle() {
        const obstacleNode = this.createObstacleNode(this.obstacles.length);
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 200;
        obstacleNode.setWorldPosition(v3(x, y, 0));
        
        this.node.addChild(obstacleNode);
        this.obstacles.push(obstacleNode);
    }

    /**
     * Clear all agents and obstacles
     */
    public clearAll() {
        for (const agent of this.agents) {
            // In a real Cocos Creator project, use agent.destroy()
            // For mock, we'll just remove from array
        }
        for (const obstacle of this.obstacles) {
            // In a real Cocos Creator project, use obstacle.destroy()
            // For mock, we'll just remove from array
        }
        this.agents = [];
        this.obstacles = [];
    }

    /**
     * Reset to initial state
     */
    public resetDemo() {
        this.clearAll();
        this.createObstacles();
        this.createAgents();
    }
}