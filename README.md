# ContextSteering-CocosCreator
A comprehensive **Cocos Creator 3.8 plugin library** for implementing contextual steering AI behaviors in 2D and 3D games.

## ✨ Features

- **🧩 Component-based development** - Modular, reusable steering behavior components
- **⚙️ Flexible configuration** - Easy-to-use configuration system for fine-tuning behaviors  
- **🎯 12 Complete Steering Behaviors** - All fundamental steering behaviors implemented
- **📘 Pure TypeScript implementation** - Type-safe, maintainable code
- **⚡ High performance** - Optimized for real-time game applications
- **🔧 Weighted Behavior Combination** - Mix multiple behaviors with configurable weights

## 🎮 Implemented Steering Behaviors

### Basic Movement Behaviors
1. **Seek** - Move towards a target position or node
2. **Flee** - Move away from a threat with configurable panic radius
3. **Arrive** - Move towards target with smooth deceleration on approach
4. **Pursue** - Predict target movement and intercept moving targets
5. **Evade** - Predict pursuer movement and escape from threats

### Group Behaviors (Flocking)
6. **Separation** - Avoid crowding nearby agents
7. **Alignment** - Align movement direction with nearby agents
8. **Cohesion** - Move towards the center of nearby agents
9. **Flock** - Combined separation, alignment, and cohesion behaviors

### Navigation Behaviors
10. **Obstacle Avoidance** - Navigate around static obstacles using lookahead
11. **Wall Following** - Follow along walls and boundaries at specified distance
12. **Path Following** - Follow predefined paths with waypoints and custom radii

## 🚀 Quick Start

### Basic Usage

```typescript
import { SteeringAgent, SeekBehavior, FlockBehavior } from './steering';

// Create an agent that seeks a target
const agent = node.addComponent(SteeringAgent);
const seek = node.addComponent(SeekBehavior);
seek.setTargetNode(targetNode);
seek.weight = 1.0;

// Create a flocking agent
const flockAgent = node.addComponent(SteeringAgent);
const flock = node.addComponent(FlockBehavior);
flock.separationWeight = 2.0;
flock.alignmentWeight = 1.0;
flock.cohesionWeight = 1.0;
```

### Advanced Configuration

```typescript
// Complex AI agent with multiple behaviors
const agent = node.addComponent(SteeringAgent);
agent.maxSpeed = 200;
agent.maxForce = 150;
agent.radius = 25;

// Seek behavior
const seek = node.addComponent(SeekBehavior);
seek.setTargetNode(target);
seek.weight = 0.8;

// Obstacle avoidance (high priority)
const avoid = node.addComponent(ObstacleAvoidanceBehavior);
avoid.weight = 3.0;

// Flocking behavior
const flock = node.addComponent(FlockBehavior);
flock.weight = 1.2;
```

## 📁 Project Structure

### Modern Steering System (NEW)
- `assets/scripts/steering/core/` - Core steering system
  - `SteeringAgent.ts` - Main agent component
  - `SteeringBehavior.ts` - Base behavior class
  - `SteeringForce.ts` - Force representation
  - `SteeringConfig.ts` - Configuration interfaces
- `assets/scripts/steering/behaviors/` - Individual behavior implementations
  - All 12 steering behaviors as separate components
- `assets/scripts/steering/utils/` - Utility functions
- `assets/scripts/steering/index.ts` - Main library exports

### Examples and Integration
- `assets/scripts/ModernSteeringManager.ts` - Comprehensive demo manager
- `assets/scripts/SteeringBehaviorExamples.ts` - Individual behavior examples
- `assets/scripts/tests/SteeringBehaviorTest.ts` - Integration tests

### Legacy System (Context Steering)
- `assets/scripts/Agent.ts` - Original context steering implementation
- `assets/scripts/ContextSteeringManager.ts` - Original scene manager

### Standalone Demo
- `demo.html` - Interactive browser demo showcasing behaviors

## 🎯 Behavior Examples

### Predator-Prey System
```typescript
// Predator
const pursuer = predatorNode.addComponent(PursueBehavior);
pursuer.setTarget(preyNode);
pursuer.predictionTime = 1.5;

// Prey
const evader = preyNode.addComponent(EvadeBehavior);
evader.setThreat(predatorNode);
evader.panicRadius = 150;
```

### Path Following
```typescript
const pathFollower = node.addComponent(PathFollowingBehavior);
pathFollower.setPath([
    v3(0, 0, 0),
    v3(100, 0, 0),
    v3(100, 100, 0),
    v3(0, 100, 0)
]);
pathFollower.loopPath = true;

// Or create circular path
pathFollower.createCircularPath(v3(0, 0, 0), 100, 8);
```

### Crowd Simulation
```typescript
const agent = node.addComponent(SteeringAgent);

// Add flocking behavior
const flock = node.addComponent(FlockBehavior);
flock.separationWeight = 2.5;  // Avoid crowding
flock.alignmentWeight = 1.5;   // Follow crowd direction
flock.cohesionWeight = 1.0;    // Stay with group

// Add obstacle avoidance for safety
const avoid = node.addComponent(ObstacleAvoidanceBehavior);
avoid.weight = 3.0; // Highest priority
```

## ⚙️ Configuration

### Agent Parameters
```typescript
const agent = node.addComponent(SteeringAgent);
agent.maxSpeed = 200;        // Maximum movement speed
agent.maxForce = 100;        // Maximum steering force
agent.mass = 1.0;           // Agent mass (affects acceleration)
agent.radius = 20;          // Agent size for collision detection
agent.showDebugInfo = true; // Enable debug visualization
```

### Behavior Weights (Recommended)
```typescript
const weights = {
    seek: 1.0,
    flee: 1.5,
    arrive: 1.0,
    pursue: 1.2,
    evade: 1.8,
    separation: 2.0,        // Higher for safety
    alignment: 1.0,
    cohesion: 1.0,
    obstacleAvoidance: 3.0, // Highest priority
    wallFollowing: 1.5,
    pathFollowing: 2.0
};
```

## 🔧 Architecture

The system follows a modular, component-based architecture:

1. **SteeringAgent** - Core component that manages movement and combines behaviors
2. **SteeringBehavior** - Base class for all steering behaviors
3. **Individual Behaviors** - Specific behavior implementations extending the base class
4. **Weighted Combination** - Multiple behaviors contribute forces based on their weights
5. **Force Integration** - Combined forces are applied to agent movement

## 📋 Requirements

- Cocos Creator 3.8+
- TypeScript support enabled
- Node.js (for compilation)

## 📖 Documentation

- [Complete Behavior Documentation](STEERING_BEHAVIORS.md) - Detailed guide for all 12 behaviors
- [.copilot-instructions.md](.copilot-instructions.md) - Development guidelines and architecture
- Inline TypeScript documentation for all classes and methods

## 🧪 Testing

Run the integration tests:

```typescript
import SteeringBehaviorTest from './tests/SteeringBehaviorTest';
SteeringBehaviorTest.runAllTests();
```

## 🎨 Examples

See the complete examples in:
- `ModernSteeringManager.ts` - Interactive demo with multiple agent types
- `SteeringBehaviorExamples.ts` - Individual behavior demonstrations
- `demo.html` - Browser-based interactive demo

## 🤝 Contributing

This project uses GitHub Copilot for development assistance. Please refer to the Copilot instructions for coding standards and best practices.

## 📄 License

*License information to be added*

## What is Context Steering?

Context steering is an advanced steering behavior technique used in game development for autonomous agent movement. The original implementation in this project provides smooth, intelligent navigation by:

1. **Context Maps**: Creating directional interest maps that evaluate movement options
2. **Obstacle Avoidance**: Using danger maps to avoid collisions
3. **Behavior Combination**: Blending multiple steering behaviors seamlessly

## Legacy Implementation

The original context steering system is preserved in:
- `assets/scripts/Agent.ts` - 16-directional context mapping with obstacle avoidance
- `assets/scripts/ContextSteeringManager.ts` - Scene management for the original system

## Modern vs Legacy

- **Legacy System**: Context steering with 16-directional mapping
- **Modern System**: 12 complete steering behaviors with component-based architecture
- **Both Systems**: Can be used together or separately based on project needs

This implementation demonstrates both classic steering behaviors and advanced context steering techniques for creating believable autonomous movement in games and simulations.

## 📋 Requirements

- Cocos Creator 3.8+
- TypeScript support enabled

## 📖 Documentation

See [.copilot-instructions.md](.copilot-instructions.md) for detailed development guidelines and architecture information.

## 🤝 Contributing

This project uses GitHub Copilot for development assistance. Please refer to the Copilot instructions for coding standards and best practices.

## 📄 License

*License information to be added*" 

## What is Context Steering?

Context steering is an advanced steering behavior technique used in game development for autonomous agent movement. It provides smooth, intelligent navigation by:

1. **Context Maps**: Creating directional interest maps that evaluate movement options
2. **Obstacle Avoidance**: Using danger maps to avoid collisions
3. **Behavior Combination**: Blending multiple steering behaviors seamlessly

## Project Structure

### TypeScript Implementation (Cocos Creator)
- `assets/scripts/Agent.ts` - Core agent with context steering behavior
- `assets/scripts/ContextSteeringManager.ts` - Scene manager for spawning agents and obstacles
- `assets/scripts/cc-mock.ts` - Mock Cocos Creator types for compilation
- `assets/scene.scene` - Cocos Creator scene setup

### Standalone Demo
- `demo.html` - Interactive browser demo showcasing context steering

## Features Implemented

### Core Context Steering System
- **16-Direction Context Maps**: Comprehensive directional evaluation for smooth navigation
- **Dynamic Obstacle Avoidance**: Real-time danger mapping with spatial falloff
- **Intelligent Force Application**: Physics-based steering with configurable limits
- **Visual Debugging**: Agent direction indicators and obstacle visualization
- **Interactive Demo**: Click-to-add agents/obstacles with live behavior observation

### Agent Behavior Characteristics
- **Direction Persistence**: Agents naturally maintain current heading unless obstacles interfere
- **Adaptive Avoidance**: Detection range scales with agent size for proportional response
- **Smooth Transitions**: Gradual steering changes prevent jittery movement
- **Boundary Management**: Seamless world-edge wrapping maintains flow

## How Context Steering Works

Context steering is an advanced AI technique that provides smooth, intelligent navigation through environmental awareness and directional evaluation:

### Core Algorithm
1. **Context Map Generation**: Each agent maintains a 16-slot directional map (22.5° per slot)
2. **Interest Calculation**: Agents prefer to continue in their current direction, with interest values calculated using dot product with velocity
3. **Danger Detection**: Nearby obstacles create danger values in corresponding directional slots
4. **Danger Propagation**: Obstacle danger spreads to adjacent slots with diminishing intensity
5. **Context Integration**: Final movement direction determined by subtracting danger from interest
6. **Force Application**: Best direction converted to steering force with realistic limits

### Implementation Specifics
- **Context Map Resolution**: 16 directional slots for balanced performance and accuracy
- **Detection Range**: Dynamic based on agent radius (3x radius + obstacle radius + buffer)
- **Danger Falloff**: Linear falloff based on distance to obstacle
- **Steering Force Limit**: Configurable maximum force prevents unrealistic movement
- **Boundary Handling**: Seamless world wrapping for continuous navigation

## Usage

### Cocos Creator Project
1. Open the project in Cocos Creator 3.8.7+
2. The scene contains a ContextSteeringManager that spawns agents and obstacles
3. Run the project to see context steering in action

### Browser Demo
1. Open `demo.html` in any modern web browser
2. Click to add agents, Ctrl+Click to add obstacles
3. Watch agents intelligently navigate around obstacles

## Technical Implementation Details

### Context Steering Algorithm Parameters
- **Context Map Resolution**: 16 directional slots (22.5° angular resolution)
- **Obstacle Detection Range**: `3 × agent.radius + obstacle.radius + 50px buffer`
- **Danger Spread**: 2-slot adjacency with linear falloff (66%, 33% of primary danger)
- **Steering Force Limit**: Configurable maximum force prevents unrealistic acceleration
- **Velocity Constraints**: Speed capping maintains realistic movement bounds
- **Update Frequency**: Real-time per-frame calculation for responsive behavior

### Agent Configuration Options
- **maxSpeed**: Maximum movement velocity (pixels/second)
- **maxForce**: Maximum steering force application
- **radius**: Agent size affecting detection ranges and visual representation
- **contextMapSize**: Directional evaluation granularity (default: 16)

### Performance Optimizations
- **Efficient Obstacle Queries**: Scene graph traversal with distance pre-filtering  
- **Vectorized Context Operations**: Batch processing of directional calculations
- **Minimal Memory Allocation**: Reused arrays and objects reduce garbage collection
- **Selective Updates**: Only recalculate context when environment changes

This implementation demonstrates the power of context steering for creating believable autonomous movement in games and simulations." 
