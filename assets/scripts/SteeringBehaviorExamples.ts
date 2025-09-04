import { Component, Node, Vec3, v3 } from './cc-mock';
import { SteeringAgent } from './steering/core/SteeringAgent';
import { SeekBehavior } from './steering/behaviors/SeekBehavior';
import { FleeBehavior } from './steering/behaviors/FleeBehavior';
import { ArriveBehavior } from './steering/behaviors/ArriveBehavior';
import { PursueBehavior } from './steering/behaviors/PursueBehavior';
import { EvadeBehavior } from './steering/behaviors/EvadeBehavior';
import { SeparationBehavior } from './steering/behaviors/SeparationBehavior';
import { AlignmentBehavior } from './steering/behaviors/AlignmentBehavior';
import { CohesionBehavior } from './steering/behaviors/CohesionBehavior';
import { FlockBehavior } from './steering/behaviors/FlockBehavior';
import { ObstacleAvoidanceBehavior } from './steering/behaviors/ObstacleAvoidanceBehavior';
import { WallFollowingBehavior } from './steering/behaviors/WallFollowingBehavior';
import { PathFollowingBehavior, PathPoint } from './steering/behaviors/PathFollowingBehavior';

/**
 * Comprehensive example demonstrating all 12 steering behaviors
 * This serves as both documentation and testing for the steering system
 */
export class SteeringBehaviorExamples {
    
    /**
     * Example 1: Basic Seek Behavior
     */
    static createSeekingAgent(scene: Node, targetPosition: Vec3): Node {
        const agent = new Node('SeekingAgent');
        
        // Add steering agent component
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 150;
        steeringAgent.maxForce = 100;
        
        // Add seek behavior
        const seekBehavior = agent.addComponent(SeekBehavior) as SeekBehavior;
        seekBehavior.setTarget(targetPosition);
        seekBehavior.weight = 1.0;
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Example 2: Flee Behavior with Panic Radius
     */
    static createFleeingAgent(scene: Node, threatPosition: Vec3): Node {
        const agent = new Node('FleeingAgent');
        
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 200;
        steeringAgent.maxForce = 150;
        
        const fleeBehavior = agent.addComponent(FleeBehavior) as FleeBehavior;
        fleeBehavior.setTarget(threatPosition);
        fleeBehavior.fleeRadius = 100;
        fleeBehavior.weight = 1.0;
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Example 3: Arrive Behavior with Deceleration
     */
    static createArrivingAgent(scene: Node, destination: Vec3): Node {
        const agent = new Node('ArrivingAgent');
        
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 180;
        steeringAgent.maxForce = 120;
        
        const arriveBehavior = agent.addComponent(ArriveBehavior) as ArriveBehavior;
        arriveBehavior.setTarget(destination);
        arriveBehavior.arrivalRadius = 15;
        arriveBehavior.slowDownRadius = 80;
        arriveBehavior.weight = 1.0;
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Example 4: Pursue Behavior (Predator-Prey)
     */
    static createPursuerAndPrey(scene: Node): { pursuer: Node, prey: Node } {
        // Create prey with wandering behavior
        const prey = new Node('Prey');
        const preyAgent = prey.addComponent(SteeringAgent) as SteeringAgent;
        preyAgent.maxSpeed = 120;
        preyAgent.maxForce = 80;
        
        // Create pursuer
        const pursuer = new Node('Pursuer');
        const pursuerAgent = pursuer.addComponent(SteeringAgent) as SteeringAgent;
        pursuerAgent.maxSpeed = 140;
        pursuerAgent.maxForce = 100;
        
        const pursueBehavior = pursuer.addComponent(PursueBehavior) as PursueBehavior;
        pursueBehavior.setTarget(prey);
        pursueBehavior.predictionTime = 1.5;
        pursueBehavior.weight = 1.0;
        
        // Add evade behavior to prey
        const evadeBehavior = prey.addComponent(EvadeBehavior) as EvadeBehavior;
        evadeBehavior.setThreat(pursuer);
        evadeBehavior.panicRadius = 120;
        evadeBehavior.weight = 1.0;
        
        scene.addChild(prey);
        scene.addChild(pursuer);
        
        return { pursuer, prey };
    }

    /**
     * Example 5: Flocking Behavior
     */
    static createFlockingAgents(scene: Node, count: number = 5): Node[] {
        const agents: Node[] = [];
        
        for (let i = 0; i < count; i++) {
            const agent = new Node(`FlockAgent${i}`);
            
            const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
            steeringAgent.maxSpeed = 100 + Math.random() * 50;
            steeringAgent.maxForce = 80 + Math.random() * 40;
            steeringAgent.radius = 15;
            
            const flockBehavior = agent.addComponent(FlockBehavior) as FlockBehavior;
            flockBehavior.separationRadius = 40;
            flockBehavior.alignmentRadius = 60;
            flockBehavior.cohesionRadius = 80;
            flockBehavior.separationWeight = 2.0;
            flockBehavior.alignmentWeight = 1.0;
            flockBehavior.cohesionWeight = 1.0;
            flockBehavior.weight = 1.0;
            
            // Random starting position
            agent.setWorldPosition(v3(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                0
            ));
            
            scene.addChild(agent);
            agents.push(agent);
        }
        
        return agents;
    }

    /**
     * Example 6: Obstacle Avoidance
     */
    static createObstacleAvoidingAgent(scene: Node): Node {
        const agent = new Node('ObstacleAvoider');
        
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 160;
        steeringAgent.maxForce = 120;
        steeringAgent.radius = 18;
        
        const obstacleAvoidance = agent.addComponent(ObstacleAvoidanceBehavior) as ObstacleAvoidanceBehavior;
        obstacleAvoidance.avoidanceDistance = 100;
        obstacleAvoidance.maxSeeAhead = 80;
        obstacleAvoidance.avoidanceForceMultiplier = 2.0;
        obstacleAvoidance.weight = 1.0;
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Example 7: Wall Following Behavior
     */
    static createWallFollowingAgent(scene: Node): Node {
        const agent = new Node('WallFollower');
        
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 120;
        steeringAgent.maxForce = 100;
        
        const wallFollowing = agent.addComponent(WallFollowingBehavior) as WallFollowingBehavior;
        wallFollowing.wallFollowDistance = 25;
        wallFollowing.wallFollowForce = 60;
        wallFollowing.wallDetectionDistance = 80;
        wallFollowing.clockwise = true;
        wallFollowing.weight = 1.0;
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Example 8: Path Following Behavior
     */
    static createPathFollowingAgent(scene: Node): Node {
        const agent = new Node('PathFollower');
        
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 140;
        steeringAgent.maxForce = 100;
        
        const pathFollowing = agent.addComponent(PathFollowingBehavior) as PathFollowingBehavior;
        pathFollowing.pathRadius = 20;
        pathFollowing.loopPath = true;
        pathFollowing.weight = 1.0;
        
        // Create a circular path
        pathFollowing.createCircularPath(v3(0, 0, 0), 150, 8);
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Example 9: Complex Behavior Combination
     */
    static createComplexAgent(scene: Node, target: Node): Node {
        const agent = new Node('ComplexAgent');
        
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 160;
        steeringAgent.maxForce = 120;
        steeringAgent.radius = 20;
        steeringAgent.showDebugInfo = true;
        
        // Seek towards target
        const seekBehavior = agent.addComponent(SeekBehavior) as SeekBehavior;
        seekBehavior.setTargetNode(target);
        seekBehavior.weight = 0.8;
        
        // Flock with other agents
        const flockBehavior = agent.addComponent(FlockBehavior) as FlockBehavior;
        flockBehavior.weight = 1.2;
        flockBehavior.separationWeight = 2.5;
        flockBehavior.alignmentWeight = 1.0;
        flockBehavior.cohesionWeight = 0.8;
        
        // Avoid obstacles
        const obstacleAvoidance = agent.addComponent(ObstacleAvoidanceBehavior) as ObstacleAvoidanceBehavior;
        obstacleAvoidance.weight = 3.0; // High priority for safety
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Example 10: Custom Path with Different Radii
     */
    static createCustomPathAgent(scene: Node): Node {
        const agent = new Node('CustomPathAgent');
        
        const steeringAgent = agent.addComponent(SteeringAgent) as SteeringAgent;
        steeringAgent.maxSpeed = 120;
        steeringAgent.maxForce = 90;
        
        const pathFollowing = agent.addComponent(PathFollowingBehavior) as PathFollowingBehavior;
        pathFollowing.loopPath = true;
        pathFollowing.weight = 1.0;
        
        // Create custom path with different radii
        const pathPoints: PathPoint[] = [
            { position: v3(-100, -50, 0), radius: 15 },
            { position: v3(100, -50, 0), radius: 25 },
            { position: v3(100, 50, 0), radius: 20 },
            { position: v3(-100, 50, 0), radius: 30 }
        ];
        pathFollowing.setPathWithRadii(pathPoints);
        
        scene.addChild(agent);
        return agent;
    }

    /**
     * Complete Demo Setup
     */
    static createCompleteDemo(scene: Node): void {
        console.log('Creating complete steering behavior demonstration...');
        
        // Create target
        const target = new Node('Target');
        target.setWorldPosition(v3(0, 0, 0));
        scene.addChild(target);
        
        // Create various behavior examples
        const seekingAgent = this.createSeekingAgent(scene, v3(100, 100, 0));
        seekingAgent.setWorldPosition(v3(-100, -100, 0));
        
        const fleeingAgent = this.createFleeingAgent(scene, v3(0, 0, 0));
        fleeingAgent.setWorldPosition(v3(50, 50, 0));
        
        const arrivingAgent = this.createArrivingAgent(scene, v3(-50, 100, 0));
        arrivingAgent.setWorldPosition(v3(100, -50, 0));
        
        const { pursuer, prey } = this.createPursuerAndPrey(scene);
        pursuer.setWorldPosition(v3(-150, 0, 0));
        prey.setWorldPosition(v3(150, 0, 0));
        
        const flockingAgents = this.createFlockingAgents(scene, 6);
        
        const obstacleAvoider = this.createObstacleAvoidingAgent(scene);
        obstacleAvoider.setWorldPosition(v3(0, -100, 0));
        
        const wallFollower = this.createWallFollowingAgent(scene);
        wallFollower.setWorldPosition(v3(-200, -200, 0));
        
        const pathFollower = this.createPathFollowingAgent(scene);
        pathFollower.setWorldPosition(v3(-150, 150, 0));
        
        const customPathAgent = this.createCustomPathAgent(scene);
        customPathAgent.setWorldPosition(v3(-100, 0, 0));
        
        const complexAgent = this.createComplexAgent(scene, target);
        complexAgent.setWorldPosition(v3(200, 200, 0));
        
        console.log('Demo created successfully! All 12 steering behaviors are now active.');
        console.log('Behaviors demonstrated:');
        console.log('1. Seek - Green agent seeks target');
        console.log('2. Flee - Red agent flees from center');
        console.log('3. Arrive - Blue agent arrives at destination');
        console.log('4. Pursue - Orange agent pursues yellow prey');
        console.log('5. Evade - Yellow prey evades orange pursuer');
        console.log('6. Separation - Purple agents maintain distance');
        console.log('7. Alignment - Purple agents align movement');
        console.log('8. Cohesion - Purple agents stay together');
        console.log('9. Flock - Purple agents exhibit flocking behavior');
        console.log('10. Obstacle Avoidance - Cyan agent avoids obstacles');
        console.log('11. Wall Following - Pink agent follows walls');
        console.log('12. Path Following - Agents follow predefined paths');
    }
}