# Steering Behaviors Documentation

This document provides comprehensive documentation for the steering behaviors system implemented in this Cocos Creator project.

## Overview

This library implements **12 fundamental steering behaviors** for autonomous agent movement in games. The system is designed to be modular, performant, and easy to use in Cocos Creator 3.8+ projects.

## Architecture

The steering system follows a component-based architecture:

- **Core System**: Base classes and interfaces
- **Individual Behaviors**: Specific steering behavior implementations
- **Utilities**: Helper functions and mathematical operations
- **Examples**: Demonstration and usage patterns

## Core Components

### SteeringAgent

The main component that manages an agent's movement and combines multiple steering behaviors.

```typescript
const agent = node.addComponent(SteeringAgent);
agent.maxSpeed = 200;
agent.maxForce = 100;
agent.radius = 20;
```

### SteeringBehavior

Base class for all steering behaviors. Each behavior calculates a steering force that influences the agent's movement.

```typescript
export abstract class SteeringBehavior extends Component {
    public weight: number = 1.0;
    public enabled: boolean = true;
    
    abstract calculateSteering(): SteeringForce;
}
```

## The 12 Steering Behaviors

### 1. Seek Behavior

Moves the agent towards a target position or node.

```typescript
const seekBehavior = agent.addComponent(SeekBehavior);
seekBehavior.setTarget(targetPosition);
seekBehavior.weight = 1.0;
```

**Use Cases:**
- Moving towards objectives
- Following players
- Homing missiles

### 2. Flee Behavior

Moves the agent away from a threat, with configurable panic radius.

```typescript
const fleeBehavior = agent.addComponent(FleeBehavior);
fleeBehavior.setTarget(threatPosition);
fleeBehavior.fleeRadius = 100;
fleeBehavior.weight = 1.5;
```

**Use Cases:**
- Escaping from danger
- Avoiding predators
- Fear responses

### 3. Arrive Behavior

Moves towards a target but decelerates as it approaches, coming to a smooth stop.

```typescript
const arriveBehavior = agent.addComponent(ArriveBehavior);
arriveBehavior.setTarget(destination);
arriveBehavior.arrivalRadius = 20;
arriveBehavior.slowDownRadius = 100;
```

**Use Cases:**
- Smooth movement to destinations
- Parking behaviors
- Precise positioning

### 4. Pursue Behavior

Predicts the target's future position and moves to intercept it.

```typescript
const pursueBehavior = agent.addComponent(PursueBehavior);
pursueBehavior.setTarget(movingTarget);
pursueBehavior.predictionTime = 1.5;
```

**Use Cases:**
- Predator behaviors
- Intercepting moving targets
- Smart targeting systems

### 5. Evade Behavior

Predicts a pursuer's movement and tries to escape.

```typescript
const evadeBehavior = agent.addComponent(EvadeBehavior);
evadeBehavior.setThreat(pursuer);
evadeBehavior.panicRadius = 150;
```

**Use Cases:**
- Prey behaviors
- Dodging attacks
- Evasive maneuvers

### 6. Separation Behavior

Maintains distance from nearby agents to avoid crowding.

```typescript
const separationBehavior = agent.addComponent(SeparationBehavior);
separationBehavior.separationRadius = 50;
separationBehavior.weight = 2.0; // Higher weight for safety
```

**Use Cases:**
- Crowd simulation
- Personal space
- Collision avoidance

### 7. Alignment Behavior

Aligns the agent's movement with nearby agents.

```typescript
const alignmentBehavior = agent.addComponent(AlignmentBehavior);
alignmentBehavior.alignmentRadius = 80;
alignmentBehavior.weight = 1.0;
```

**Use Cases:**
- Formation flying
- Traffic flow
- Group coordination

### 8. Cohesion Behavior

Moves the agent towards the center of nearby agents.

```typescript
const cohesionBehavior = agent.addComponent(CohesionBehavior);
cohesionBehavior.cohesionRadius = 100;
cohesionBehavior.weight = 1.0;
```

**Use Cases:**
- Group formation
- Herding behaviors
- Stay together mechanics

### 9. Flock Behavior

Combines separation, alignment, and cohesion for realistic flocking.

```typescript
const flockBehavior = agent.addComponent(FlockBehavior);
flockBehavior.separationWeight = 2.0;
flockBehavior.alignmentWeight = 1.0;
flockBehavior.cohesionWeight = 1.0;
```

**Use Cases:**
- Bird flocking
- Fish schooling
- Crowd simulation
- Group AI

### 10. Obstacle Avoidance Behavior

Navigates around static obstacles using look-ahead collision detection.

```typescript
const obstacleAvoidance = agent.addComponent(ObstacleAvoidanceBehavior);
obstacleAvoidance.avoidanceDistance = 150;
obstacleAvoidance.maxSeeAhead = 100;
obstacleAvoidance.weight = 3.0; // High priority
```

**Use Cases:**
- Navigation meshes
- Environment traversal
- Safety systems

### 11. Wall Following Behavior

Follows along walls and boundaries at a specified distance.

```typescript
const wallFollowing = agent.addComponent(WallFollowingBehavior);
wallFollowing.wallFollowDistance = 30;
wallFollowing.clockwise = true;
wallFollowing.weight = 1.5;
```

**Use Cases:**
- Patrolling guards
- Maze navigation
- Perimeter following

### 12. Path Following Behavior

Follows a predefined path with waypoints.

```typescript
const pathFollowing = agent.addComponent(PathFollowingBehavior);
pathFollowing.setPath([
    v3(0, 0, 0),
    v3(100, 0, 0),
    v3(100, 100, 0),
    v3(0, 100, 0)
]);
pathFollowing.loopPath = true;
```

**Use Cases:**
- NPC patrol routes
- Racing tracks
- Guided tours
- Animation paths

## Behavior Combination

Multiple behaviors can be combined on a single agent, with each behavior contributing a weighted force:

```typescript
// Create agent with multiple behaviors
const agent = node.addComponent(SteeringAgent);

// Add seeking behavior
const seek = node.addComponent(SeekBehavior);
seek.weight = 0.8;

// Add flocking behavior
const flock = node.addComponent(FlockBehavior);
flock.weight = 1.2;

// Add obstacle avoidance (high priority)
const avoid = node.addComponent(ObstacleAvoidanceBehavior);
avoid.weight = 3.0;
```

## Configuration

### Agent Configuration

```typescript
interface SteeringConfig {
    maxSpeed: number;           // Maximum movement speed
    maxForce: number;           // Maximum steering force
    mass: number;              // Agent mass (affects acceleration)
    arrivalRadius: number;      // Arrival behavior parameters
    slowDownRadius: number;
    separationRadius: number;   // Group behavior parameters
    alignmentRadius: number;
    cohesionRadius: number;
    obstacleAvoidanceDistance: number;  // Obstacle avoidance parameters
    maxSeeAhead: number;
    wallFollowDistance: number; // Wall following parameters
    wallFollowForce: number;
    pathFollowRadius: number;   // Path following parameters
    pathSeekRadius: number;
}
```

### Behavior Weights

```typescript
interface BehaviorWeights {
    seek: number;
    flee: number;
    arrive: number;
    pursue: number;
    evade: number;
    separation: number;        // Recommended: 2.0 (safety)
    alignment: number;
    cohesion: number;
    obstacleAvoidance: number; // Recommended: 3.0 (highest priority)
    wallFollowing: number;
    pathFollowing: number;
    wander: number;
}
```

## Usage Examples

### Basic Setup

```typescript
// Create a simple seeking agent
const agent = SteeringSetup.setupSeeker(agentNode, targetNode);

// Create a flocking agent
const flockAgent = SteeringSetup.setupFlockAgent(agentNode);

// Create a complete AI agent with multiple behaviors
const aiAgent = SteeringSetup.setupCompleteAgent(agentNode);
```

### Advanced Configuration

```typescript
// Manual setup for complex behaviors
const agent = node.addComponent(SteeringAgent);
agent.maxSpeed = 200;
agent.maxForce = 150;
agent.radius = 25;

// Add weighted behaviors
const seek = node.addComponent(SeekBehavior);
seek.setTargetNode(target);
seek.weight = 0.5;

const flee = node.addComponent(FleeBehavior);
flee.setTargetNode(threat);
flee.fleeRadius = 100;
flee.weight = 1.5;

const flock = node.addComponent(FlockBehavior);
flock.separationWeight = 2.5;
flock.alignmentWeight = 1.0;
flock.cohesionWeight = 0.8;
flock.weight = 1.0;

const avoid = node.addComponent(ObstacleAvoidanceBehavior);
avoid.weight = 3.0; // Highest priority for safety
```

## Performance Considerations

### Optimization Tips

1. **Use appropriate radii**: Smaller detection radii improve performance
2. **Limit agent count**: Consider LOD systems for large numbers of agents
3. **Spatial partitioning**: Use scene management for neighbor queries
4. **Behavior selection**: Only enable necessary behaviors
5. **Update frequency**: Consider less frequent updates for distant agents

### Efficient Neighbor Queries

```typescript
// The system automatically handles neighbor finding
// But you can optimize by adjusting detection radii
flockBehavior.separationRadius = 40;  // Smaller = faster
flockBehavior.alignmentRadius = 60;
flockBehavior.cohesionRadius = 80;
```

## Debugging and Visualization

Enable debug visualization to understand behavior:

```typescript
agent.showDebugInfo = true; // Shows force vectors and debug information
```

## Integration with Cocos Creator

The system is designed to work seamlessly with Cocos Creator's component system:

- Components can be added in the editor or via code
- Properties are configurable in the inspector
- Works with both 2D and 3D coordinate systems
- Integrates with physics and collision systems

## Extending the System

### Creating Custom Behaviors

```typescript
export class CustomBehavior extends SteeringBehavior {
    calculateSteering(): SteeringForce {
        // Implement your custom steering logic
        const force = v3(0, 0, 0);
        // ... calculate force based on your needs
        return new SteeringForce(force, this.weight);
    }
}
```

### Adding New Configuration Options

Extend the `SteeringConfig` interface and update the default configuration.

## Common Patterns

### Predator-Prey System

```typescript
// Predator
const pursuer = node.addComponent(PursueBehavior);
pursuer.setTarget(preyNode);

// Prey  
const evader = preyNode.addComponent(EvadeBehavior);
evader.setThreat(node);
```

### Guard Patrol

```typescript
const pathFollowing = guard.addComponent(PathFollowingBehavior);
pathFollowing.setPath(patrolWaypoints);
pathFollowing.loopPath = true;

const obstacleAvoidance = guard.addComponent(ObstacleAvoidanceBehavior);
obstacleAvoidance.weight = 2.0;
```

### Crowd Simulation

```typescript
const flock = agent.addComponent(FlockBehavior);
flock.separationWeight = 2.0;  // Avoid crowding
flock.alignmentWeight = 1.5;   // Follow crowd direction
flock.cohesionWeight = 1.0;    // Stay with group

const avoid = agent.addComponent(ObstacleAvoidanceBehavior);
avoid.weight = 3.0;            // Safety first
```

This steering behaviors system provides a solid foundation for creating believable and engaging AI movement in your Cocos Creator games. The modular design allows for easy customization and extension to meet your specific game requirements.