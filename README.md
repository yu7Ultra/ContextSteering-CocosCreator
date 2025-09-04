# ContextSteering-CocosCreator
A comprehensive **Cocos Creator 3.8 plugin library** for implementing contextual steering AI behaviors in 2D and 3D games.

## ✨ Features

- **🧩 Component-based development** - Modular, reusable steering behavior components
- **⚙️ Flexible configuration** - Easy-to-use configuration system for fine-tuning behaviors  
- **🎯 Context steering algorithm** - Advanced steering using directional context maps
- **📘 Pure TypeScript implementation** - Type-safe, maintainable code
- **⚡ High performance** - Optimized for real-time game applications

## 🎮 Implemented Steering Behaviors

### Context-Based Navigation
- **Context Steering** - 16-directional context mapping for intelligent navigation
- **Obstacle Avoidance** - Dynamic danger mapping with spatial awareness
- **Direction Persistence** - Agents prefer to maintain current movement direction
- **Smooth Steering** - Force-based movement with realistic physics constraints

### Technical Implementation Details
- **16-Direction Context Maps** - Each agent evaluates movement options in 22.5° increments
- **Danger Map Integration** - Obstacles create danger fields that influence steering decisions
- **Adaptive Detection Range** - 3x agent radius for obstacle detection with falloff
- **Force Limiting** - Steering forces are capped for realistic movement behavior

## 🤖 Emergent Steering Behaviors

The context steering system naturally produces several classic steering behaviors:

### Primary Behaviors
- **Wander** - Agents exhibit natural wandering when no obstacles are present
- **Obstacle Avoidance** - Dynamic avoidance of static environmental hazards
- **Momentum Conservation** - Preference for maintaining current direction reduces oscillation
- **Smooth Navigation** - Gradual direction changes create natural-looking movement patterns

### Emergent Group Behaviors
When multiple agents are present, the system exhibits:
- **Implicit Separation** - Agents naturally avoid crowding through obstacle avoidance mechanics
- **Flow Dynamics** - Multiple agents create natural traffic flow patterns
- **Adaptive Spacing** - Agent density self-regulates based on available space

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
