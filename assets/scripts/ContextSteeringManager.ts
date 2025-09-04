import { _decorator, Component, Node, Prefab, instantiate, Vec3, v3, Color, Graphics, UITransform } from 'cc';
import { Agent } from './Agent';
const { ccclass, property } = _decorator;

@ccclass('ContextSteeringManager')
export class ContextSteeringManager extends Component {
    @property(Prefab)
    agentPrefab: Prefab = null;
    
    @property
    numberOfAgents: number = 5;
    
    @property
    numberOfObstacles: number = 3;

    private agents: Node[] = [];
    private obstacles: Node[] = [];

    start() {
        this.createObstacles();
        this.createAgents();
    }

    private createAgents() {
        for (let i = 0; i < this.numberOfAgents; i++) {
            let agentNode: Node;
            
            if (this.agentPrefab) {
                agentNode = instantiate(this.agentPrefab);
            } else {
                // Create agent node manually if no prefab is provided
                agentNode = this.createAgentNode();
            }
            
            // Position randomly
            const x = (Math.random() - 0.5) * 600;
            const y = (Math.random() - 0.5) * 400;
            agentNode.setWorldPosition(v3(x, y, 0));
            
            // Add to scene
            this.node.addChild(agentNode);
            this.agents.push(agentNode);
        }
    }

    private createAgentNode(): Node {
        const agentNode = new Node('Agent');
        
        // Add Agent component
        const agentComp = agentNode.addComponent(Agent);
        agentComp.maxSpeed = 150 + Math.random() * 100; // Vary speed
        agentComp.radius = 15 + Math.random() * 10; // Vary size
        
        // Create visual representation
        const graphics = agentNode.addComponent(Graphics);
        graphics.fillColor = new Color(100 + Math.random() * 155, 100 + Math.random() * 155, 100 + Math.random() * 155, 255);
        graphics.circle(0, 0, agentComp.radius);
        graphics.fill();
        
        // Add a direction indicator
        graphics.strokeColor = Color.WHITE;
        graphics.lineWidth = 2;
        graphics.moveTo(0, 0);
        graphics.lineTo(agentComp.radius, 0);
        graphics.stroke();
        
        // Set up UI transform for proper rendering
        const uiTransform = agentNode.addComponent(UITransform);
        uiTransform.setContentSize(agentComp.radius * 2, agentComp.radius * 2);
        
        return agentNode;
    }

    private createObstacles() {
        for (let i = 0; i < this.numberOfObstacles; i++) {
            const obstacleNode = this.createObstacleNode(i);
            
            // Position randomly but not too close to center
            let x, y;
            do {
                x = (Math.random() - 0.5) * 500;
                y = (Math.random() - 0.5) * 300;
            } while (Math.abs(x) < 100 && Math.abs(y) < 100); // Avoid center
            
            obstacleNode.setWorldPosition(v3(x, y, 0));
            this.node.addChild(obstacleNode);
            this.obstacles.push(obstacleNode);
        }
    }

    private createObstacleNode(index: number): Node {
        const obstacleNode = new Node(`Obstacle${index}`);
        
        // Create visual representation
        const graphics = obstacleNode.addComponent(Graphics);
        graphics.fillColor = Color.RED;
        
        const size = 30 + Math.random() * 40;
        
        // Create different shapes for variety
        if (Math.random() > 0.5) {
            // Circle obstacle
            graphics.circle(0, 0, size / 2);
        } else {
            // Square obstacle
            graphics.rect(-size / 2, -size / 2, size, size);
        }
        
        graphics.fill();
        
        // Set up UI transform
        const uiTransform = obstacleNode.addComponent(UITransform);
        uiTransform.setContentSize(size, size);
        
        return obstacleNode;
    }

    update(deltaTime: number) {
        // Update agent direction indicators
        for (const agentNode of this.agents) {
            const agentComp = agentNode.getComponent(Agent);
            if (agentComp && agentComp['velocity']) {
                const vel = agentComp['velocity'] as Vec3;
                if (vel.lengthSqr() > 0) {
                    const angle = Math.atan2(vel.y, vel.x);
                    agentNode.angle = -angle * 180 / Math.PI; // Convert to degrees and apply
                }
            }
        }
    }
}