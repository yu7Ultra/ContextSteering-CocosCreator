import { Node, Vec3, v3 } from '../../cc-mock';
import { SteeringBehavior } from '../core/SteeringBehavior';
import { SteeringForce } from '../core/SteeringForce';


/**
 * Wall Following behavior - follow along walls and boundaries
 */
// // @ccclass('WallFollowingBehavior')
// // @menu('Steering/Behaviors/Wall Following')
export class WallFollowingBehavior extends SteeringBehavior {
    // // @property({ range: [10, 100] })
    public wallFollowDistance: number = 30;

    // // @property({ range: [10, 200] })
    public wallFollowForce: number = 50;

    // // @property({ range: [50, 300] })
    public wallDetectionDistance: number = 100;

    // @property
    public clockwise: boolean = true;

    calculateSteering(): SteeringForce {
        const walls = this.findNearbyWalls();
        
        if (walls.length === 0) {
            return SteeringForce.zero();
        }

        // Find the closest wall
        let closestWall: { position: Vec3, normal: Vec3, distance: number } = null;
        let minDistance = Infinity;

        for (const wall of walls) {
            if (wall.distance < minDistance) {
                minDistance = wall.distance;
                closestWall = wall;
            }
        }

        if (!closestWall) {
            return SteeringForce.zero();
        }

        const wallFollowingForce = this.calculateWallFollowingForce(closestWall);
        
        // Limit the force
        this.limitVector(wallFollowingForce, this.agent.config.maxForce);

        return new SteeringForce(wallFollowingForce, this.weight);
    }

    private findNearbyWalls(): Array<{ position: Vec3, normal: Vec3, distance: number }> {
        const walls: Array<{ position: Vec3, normal: Vec3, distance: number }> = [];
        const position = this.node.worldPosition;

        // Check world boundaries as walls
        const worldBounds = { width: 800, height: 600 };
        const halfWidth = worldBounds.width / 2;
        const halfHeight = worldBounds.height / 2;

        // Left wall
        const leftDistance = Math.abs(position.x - (-halfWidth));
        if (leftDistance < this.wallDetectionDistance) {
            walls.push({
                position: v3(-halfWidth, position.y, 0),
                normal: v3(1, 0, 0), // Normal points inward
                distance: leftDistance
            });
        }

        // Right wall
        const rightDistance = Math.abs(position.x - halfWidth);
        if (rightDistance < this.wallDetectionDistance) {
            walls.push({
                position: v3(halfWidth, position.y, 0),
                normal: v3(-1, 0, 0), // Normal points inward
                distance: rightDistance
            });
        }

        // Bottom wall
        const bottomDistance = Math.abs(position.y - (-halfHeight));
        if (bottomDistance < this.wallDetectionDistance) {
            walls.push({
                position: v3(position.x, -halfHeight, 0),
                normal: v3(0, 1, 0), // Normal points inward
                distance: bottomDistance
            });
        }

        // Top wall
        const topDistance = Math.abs(position.y - halfHeight);
        if (topDistance < this.wallDetectionDistance) {
            walls.push({
                position: v3(position.x, halfHeight, 0),
                normal: v3(0, -1, 0), // Normal points inward
                distance: topDistance
            });
        }

        // TODO: Add obstacle walls detection here
        // For now, just return boundary walls

        return walls;
    }

    private calculateWallFollowingForce(wall: { position: Vec3, normal: Vec3, distance: number }): Vec3 {
        const force = v3(0, 0, 0);

        // Calculate desired position (wallFollowDistance away from wall)
        const desiredPosition = wall.position.clone().add(
            wall.normal.clone().multiplyScalar(this.wallFollowDistance)
        );

        // If too close to wall, move away
        if (wall.distance < this.wallFollowDistance) {
            const awayFromWall = wall.normal.clone().multiplyScalar(this.wallFollowForce);
            force.add(awayFromWall);
        }
        // If too far from wall, move closer
        else if (wall.distance > this.wallFollowDistance * 1.5) {
            const towardsWall = wall.normal.clone().multiplyScalar(-this.wallFollowForce * 0.5);
            force.add(towardsWall);
        }

        // Add tangential force (parallel to wall)
        const tangent = this.calculateWallTangent(wall.normal);
        const tangentForce = tangent.multiplyScalar(this.wallFollowForce);
        force.add(tangentForce);

        return force;
    }

    private calculateWallTangent(wallNormal: Vec3): Vec3 {
        // Calculate perpendicular vector to wall normal
        let tangent: Vec3;
        
        if (this.clockwise) {
            // Rotate 90 degrees clockwise
            tangent = v3(wallNormal.y, -wallNormal.x, 0);
        } else {
            // Rotate 90 degrees counter-clockwise
            tangent = v3(-wallNormal.y, wallNormal.x, 0);
        }

        return tangent.normalize();
    }

    /**
     * Check if currently following a wall
     */
    public isFollowingWall(): boolean {
        const walls = this.findNearbyWalls();
        return walls.length > 0;
    }

    /**
     * Get the closest wall information
     */
    public getClosestWall(): { position: Vec3, normal: Vec3, distance: number } | null {
        const walls = this.findNearbyWalls();
        
        if (walls.length === 0) {
            return null;
        }

        let closestWall: { position: Vec3, normal: Vec3, distance: number } = null;
        let minDistance = Infinity;

        for (const wall of walls) {
            if (wall.distance < minDistance) {
                minDistance = wall.distance;
                closestWall = wall;
            }
        }

        return closestWall;
    }

    /**
     * Set wall following direction
     */
    public setDirection(clockwise: boolean) {
        this.clockwise = clockwise;
    }

    /**
     * Toggle wall following direction
     */
    public toggleDirection() {
        this.clockwise = !this.clockwise;
    }

    /**
     * Get current wall following direction
     */
    public getDirection(): string {
        return this.clockwise ? 'Clockwise' : 'Counter-clockwise';
    }
}