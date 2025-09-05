import { Vec3, v3 } from '../../cc-mock';

/**
 * Represents a steering force with magnitude and direction
 */
export class SteeringForce {
    public force: Vec3;
    public weight: number;

    constructor(force: Vec3 = v3(0, 0, 0), weight: number = 1.0) {
        this.force = force.clone();
        this.weight = weight;
    }

    /**
     * Apply weight to the force
     */
    public getWeightedForce(): Vec3 {
        return this.force.clone().multiplyScalar(this.weight);
    }

    /**
     * Limit the force to a maximum magnitude
     */
    public limit(maxForce: number): SteeringForce {
        const weightedForce = this.getWeightedForce();
        if (weightedForce.lengthSqr() > maxForce * maxForce) {
            weightedForce.normalize().multiplyScalar(maxForce);
            this.force = weightedForce.clone().multiplyScalar(1 / this.weight);
        }
        return this;
    }

    /**
     * Create a zero steering force
     */
    static zero(): SteeringForce {
        return new SteeringForce(v3(0, 0, 0), 0);
    }
}