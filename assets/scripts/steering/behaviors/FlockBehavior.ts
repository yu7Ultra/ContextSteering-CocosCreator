import { Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';
import { SeparationBehavior } from './SeparationBehavior';
import { AlignmentBehavior } from './AlignmentBehavior';
import { CohesionBehavior } from './CohesionBehavior';

const { ccclass, property, menu } = _decorator;

/**
 * Flock behavior - combines separation, alignment, and cohesion
 * This is a composite behavior that automatically manages the three flocking behaviors
 */
@ccclass('FlockBehavior')
@menu('Steering/Behaviors/Flock')
export class FlockBehavior extends SteeringBehavior {
    @property({ range: [10, 200] })
    public separationRadius: number = 50;

    @property({ range: [20, 300] })
    public alignmentRadius: number = 80;

    @property({ range: [30, 400] })
    public cohesionRadius: number = 100;

    @property({ range: [0.1, 5], slide: true })
    public separationWeight: number = 2.0;

    @property({ range: [0.1, 5], slide: true })
    public alignmentWeight: number = 1.0;

    @property({ range: [0.1, 5], slide: true })
    public cohesionWeight: number = 1.0;

    private separationBehavior: SeparationBehavior;
    private alignmentBehavior: AlignmentBehavior;
    private cohesionBehavior: CohesionBehavior;

    onLoad() {
        super.onLoad();
        this.initializeSubBehaviors();
    }

    private initializeSubBehaviors() {
        // Create internal behavior components (not added to node)
        this.separationBehavior = new SeparationBehavior();
        this.alignmentBehavior = new AlignmentBehavior();
        this.cohesionBehavior = new CohesionBehavior();

        // Initialize them with this node and agent
        this.separationBehavior.node = this.node;
        (this.separationBehavior as any).agent = this.agent;
        this.separationBehavior.enabled = true;

        this.alignmentBehavior.node = this.node;
        (this.alignmentBehavior as any).agent = this.agent;
        this.alignmentBehavior.enabled = true;

        this.cohesionBehavior.node = this.node;
        (this.cohesionBehavior as any).agent = this.agent;
        this.cohesionBehavior.enabled = true;
    }

    calculateSteering(): SteeringForce {
        if (!this.separationBehavior || !this.alignmentBehavior || !this.cohesionBehavior) {
            this.initializeSubBehaviors();
        }

        // Update sub-behavior parameters
        this.separationBehavior.separationRadius = this.separationRadius;
        this.alignmentBehavior.alignmentRadius = this.alignmentRadius;
        this.cohesionBehavior.cohesionRadius = this.cohesionRadius;

        // Calculate individual forces
        const separationForce = this.separationBehavior.calculateSteering().getWeightedForce();
        const alignmentForce = this.alignmentBehavior.calculateSteering().getWeightedForce();
        const cohesionForce = this.cohesionBehavior.calculateSteering().getWeightedForce();

        // Combine with weights
        const totalForce = v3(0, 0, 0);
        totalForce.add(separationForce.multiplyScalar(this.separationWeight));
        totalForce.add(alignmentForce.multiplyScalar(this.alignmentWeight));
        totalForce.add(cohesionForce.multiplyScalar(this.cohesionWeight));

        // Normalize weights
        const totalWeight = this.separationWeight + this.alignmentWeight + this.cohesionWeight;
        if (totalWeight > 0) {
            totalForce.multiplyScalar(1.0 / totalWeight);
        }

        // Limit the force
        this.limitVector(totalForce, this.agent.config.maxForce);

        return new SteeringForce(totalForce, this.weight);
    }

    /**
     * Get the number of nearby agents affecting flocking
     */
    public getNearbyAgentCount(): number {
        const maxRadius = Math.max(this.separationRadius, this.alignmentRadius, this.cohesionRadius);
        return this.agent.findNearbyAgents(maxRadius).length;
    }

    /**
     * Check if any flocking behavior is active
     */
    public isFlockingActive(): boolean {
        return this.getNearbyAgentCount() > 0;
    }

    /**
     * Get individual behavior strengths
     */
    public getBehaviorStrengths(): { separation: number, alignment: number, cohesion: number } {
        if (!this.separationBehavior || !this.alignmentBehavior || !this.cohesionBehavior) {
            return { separation: 0, alignment: 0, cohesion: 0 };
        }

        return {
            separation: this.separationBehavior.isSeparationActive() ? 1 : 0,
            alignment: this.alignmentBehavior.isAlignmentActive() ? this.alignmentBehavior.getAlignmentStrength() : 0,
            cohesion: this.cohesionBehavior.isCohesionActive() ? this.cohesionBehavior.getCohesionStrength() : 0
        };
    }

    /**
     * Get the center of mass for the flock
     */
    public getFlockCenter(): Vec3 {
        if (!this.cohesionBehavior) {
            return this.node.worldPosition.clone();
        }
        return this.cohesionBehavior.getCenterOfMass();
    }

    /**
     * Get the average flock velocity
     */
    public getFlockVelocity(): Vec3 {
        if (!this.alignmentBehavior) {
            return this.agent.getVelocity();
        }
        return this.alignmentBehavior.getAverageVelocityDirection()
            .multiplyScalar(this.agent.config.maxSpeed);
    }
}