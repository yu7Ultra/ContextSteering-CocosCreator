import { Vec3, v3, _decorator } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';

const { ccclass, property, menu } = _decorator;

/**
 * Represents a path point
 */
export interface PathPoint {
    position: Vec3;
    radius?: number; // Optional radius for path following tolerance
}

/**
 * Path Following behavior - follow a predefined path or waypoints
 */
@ccclass('PathFollowingBehavior')
@menu('Steering/Behaviors/Path Following')
export class PathFollowingBehavior extends SteeringBehavior {
    @property({ range: [10, 100] })
    public pathRadius: number = 20;

    @property({ range: [20, 100] })
    public seekRadius: number = 50;

    @property
    public loopPath: boolean = true;

    @property
    public reverseDirection: boolean = false;

    private path: PathPoint[] = [];
    private currentPathIndex: number = 0;
    private pathDirection: number = 1; // 1 for forward, -1 for reverse

    calculateSteering(): SteeringForce {
        if (this.path.length === 0) {
            return SteeringForce.zero();
        }

        // Find the current target waypoint
        const targetPoint = this.getCurrentTarget();
        if (!targetPoint) {
            return SteeringForce.zero();
        }

        // Check if we've reached the current waypoint
        const distanceToTarget = Vec3.distance(this.node.worldPosition, targetPoint.position);
        const waypointRadius = targetPoint.radius || this.pathRadius;

        if (distanceToTarget <= waypointRadius) {
            this.advanceToNextWaypoint();
            // Get new target after advancing
            const newTarget = this.getCurrentTarget();
            if (newTarget) {
                return new SteeringForce(this.seek(newTarget.position), this.weight);
            } else {
                return SteeringForce.zero();
            }
        }

        // Seek towards current target
        const seekForce = this.seek(targetPoint.position);
        
        // Limit the force
        this.limitVector(seekForce, this.agent.config.maxForce);

        return new SteeringForce(seekForce, this.weight);
    }

    private getCurrentTarget(): PathPoint | null {
        if (this.path.length === 0 || this.currentPathIndex < 0 || this.currentPathIndex >= this.path.length) {
            return null;
        }
        return this.path[this.currentPathIndex];
    }

    private advanceToNextWaypoint() {
        if (this.path.length === 0) return;

        if (this.reverseDirection) {
            this.pathDirection = -this.pathDirection;
        }

        this.currentPathIndex += this.pathDirection;

        // Handle path boundaries
        if (this.currentPathIndex >= this.path.length) {
            if (this.loopPath) {
                this.currentPathIndex = 0;
            } else {
                this.currentPathIndex = this.path.length - 1;
                this.pathDirection = -1; // Reverse direction at end
            }
        } else if (this.currentPathIndex < 0) {
            if (this.loopPath) {
                this.currentPathIndex = this.path.length - 1;
            } else {
                this.currentPathIndex = 0;
                this.pathDirection = 1; // Forward direction at beginning
            }
        }
    }

    /**
     * Set the path to follow
     */
    public setPath(waypoints: Vec3[], loopPath: boolean = true) {
        this.path = waypoints.map(pos => ({ position: pos.clone() }));
        this.loopPath = loopPath;
        this.currentPathIndex = 0;
        this.pathDirection = 1;
    }

    /**
     * Set path with custom radii for each waypoint
     */
    public setPathWithRadii(pathPoints: PathPoint[], loopPath: boolean = true) {
        this.path = pathPoints.map(point => ({ 
            position: point.position.clone(),
            radius: point.radius || this.pathRadius
        }));
        this.loopPath = loopPath;
        this.currentPathIndex = 0;
        this.pathDirection = 1;
    }

    /**
     * Add a waypoint to the path
     */
    public addWaypoint(position: Vec3, radius?: number) {
        this.path.push({ 
            position: position.clone(),
            radius: radius || this.pathRadius
        });
    }

    /**
     * Clear the path
     */
    public clearPath() {
        this.path = [];
        this.currentPathIndex = 0;
        this.pathDirection = 1;
    }

    /**
     * Get current path
     */
    public getPath(): PathPoint[] {
        return [...this.path]; // Return copy
    }

    /**
     * Get current target waypoint
     */
    public getCurrentWaypoint(): PathPoint | null {
        return this.getCurrentTarget();
    }

    /**
     * Get current waypoint index
     */
    public getCurrentWaypointIndex(): number {
        return this.currentPathIndex;
    }

    /**
     * Set current waypoint index
     */
    public setCurrentWaypointIndex(index: number) {
        if (index >= 0 && index < this.path.length) {
            this.currentPathIndex = index;
        }
    }

    /**
     * Check if path following is active
     */
    public isFollowingPath(): boolean {
        return this.path.length > 0;
    }

    /**
     * Get progress along the path (0 to 1)
     */
    public getPathProgress(): number {
        if (this.path.length <= 1) {
            return this.path.length > 0 ? 1 : 0;
        }
        
        return this.currentPathIndex / (this.path.length - 1);
    }

    /**
     * Get distance to current waypoint
     */
    public getDistanceToWaypoint(): number {
        const target = this.getCurrentTarget();
        if (!target) {
            return 0;
        }
        return Vec3.distance(this.node.worldPosition, target.position);
    }

    /**
     * Check if at end of path (for non-looping paths)
     */
    public isAtEndOfPath(): boolean {
        if (this.loopPath) {
            return false;
        }
        
        return (this.currentPathIndex === this.path.length - 1 && this.pathDirection === 1) ||
               (this.currentPathIndex === 0 && this.pathDirection === -1);
    }

    /**
     * Reset to beginning of path
     */
    public resetPath() {
        this.currentPathIndex = 0;
        this.pathDirection = 1;
    }

    /**
     * Reverse path direction
     */
    public reversePath() {
        this.pathDirection *= -1;
    }

    /**
     * Create a circular path
     */
    public createCircularPath(center: Vec3, radius: number, numPoints: number = 8) {
        this.clearPath();
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const x = center.x + Math.cos(angle) * radius;
            const y = center.y + Math.sin(angle) * radius;
            this.addWaypoint(v3(x, y, 0));
        }
        
        this.loopPath = true;
    }

    /**
     * Create a rectangular path
     */
    public createRectangularPath(topLeft: Vec3, bottomRight: Vec3) {
        this.clearPath();
        
        this.addWaypoint(v3(topLeft.x, topLeft.y, 0));
        this.addWaypoint(v3(bottomRight.x, topLeft.y, 0));
        this.addWaypoint(v3(bottomRight.x, bottomRight.y, 0));
        this.addWaypoint(v3(topLeft.x, bottomRight.y, 0));
        
        this.loopPath = true;
    }
}