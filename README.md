# ContextSteering-CocosCreator
A comprehensive **Cocos Creator 3.8 plugin library** for implementing contextual steering AI behaviors in 2D and 3D games.

## ✨ Features

- **🧩 Component-based development** - Modular, reusable steering behavior components
- **⚙️ Flexible configuration** - Easy-to-use configuration system for fine-tuning behaviors  
- **🎯 12 steering behaviors** - Complete set of fundamental AI steering behaviors
- **📘 Pure TypeScript implementation** - Type-safe, maintainable code
- **⚡ High performance** - Optimized for real-time game applications

## 🎮 Supported Steering Behaviors

### Basic Behaviors
- **Seek** - Move towards a target position
- **Flee** - Move away from a target position  
- **Arrive** - Move towards target with deceleration
- **Pursue** - Predict and intercept moving targets
- **Evade** - Predict and escape from pursuers

### Group Behaviors  
- **Separation** - Avoid crowding nearby agents
- **Alignment** - Align movement with neighbors
- **Cohesion** - Move towards group center
- **Flock** - Combined flocking behavior

### Navigation Behaviors
- **Obstacle Avoidance** - Navigate around static obstacles
- **Wall Following** - Follow walls and boundaries
- **Path Following** - Follow predefined paths

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

- **Context Maps**: 16-direction interest evaluation
- **Obstacle Avoidance**: Dynamic danger mapping with falloff
- **Smooth Steering**: Force-based movement with velocity limits
- **Visual Feedback**: Agent direction indicators and obstacle visualization
- **Interactive Demo**: Click to add agents/obstacles and observe behavior

## How Context Steering Works

1. **Interest Generation**: Agents prefer to continue in their current direction
2. **Danger Detection**: Nearby obstacles create danger in specific directions
3. **Context Combination**: Interest is reduced by danger to find safe directions
4. **Steering Forces**: Best direction is converted to steering force
5. **Movement**: Forces are applied to velocity with realistic physics

## Usage

### Cocos Creator Project
1. Open the project in Cocos Creator 3.8.7+
2. The scene contains a ContextSteeringManager that spawns agents and obstacles
3. Run the project to see context steering in action

### Browser Demo
1. Open `demo.html` in any modern web browser
2. Click to add agents, Ctrl+Click to add obstacles
3. Watch agents intelligently navigate around obstacles

## Technical Details

- **Context Map Resolution**: 16 directional slots (22.5° each)
- **Detection Range**: 3x agent radius for obstacle detection
- **Danger Spread**: Adjacent slots receive proportional danger
- **Force Limiting**: Steering forces are capped for realistic movement
- **Boundary Handling**: Agents wrap around screen edges

This implementation demonstrates the power of context steering for creating believable autonomous movement in games and simulations." 
