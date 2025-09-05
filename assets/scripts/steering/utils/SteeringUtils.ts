import { Vec3, v3 } from '../../cc-mock';

/**
 * Utility functions for steering behaviors
 */
export class SteeringUtils {
    /**
     * Clamp a value between min and max
     */
    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Linear interpolation between two values
     */
    static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    /**
     * Linear interpolation between two vectors
     */
    static lerpVec3(a: Vec3, b: Vec3, t: number, out?: Vec3): Vec3 {
        const result = out || new Vec3();
        result.x = this.lerp(a.x, b.x, t);
        result.y = this.lerp(a.y, b.y, t);
        result.z = this.lerp(a.z, b.z, t);
        return result;
    }

    /**
     * Map a value from one range to another
     */
    static mapRange(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
        return toMin + (value - fromMin) * (toMax - toMin) / (fromMax - fromMin);
    }

    /**
     * Calculate angle between two vectors in radians
     */
    static angleBetween(a: Vec3, b: Vec3): number {
        const dot = Vec3.dot(a.clone().normalize(), b.clone().normalize());
        return Math.acos(this.clamp(dot, -1, 1));
    }

    /**
     * Get perpendicular vector (90 degrees counter-clockwise)
     */
    static perpendicular(vector: Vec3): Vec3 {
        return v3(-vector.y, vector.x, vector.z);
    }

    /**
     * Get perpendicular vector (90 degrees clockwise)
     */
    static perpendicularCW(vector: Vec3): Vec3 {
        return v3(vector.y, -vector.x, vector.z);
    }

    /**
     * Project vector a onto vector b
     */
    static project(a: Vec3, b: Vec3): Vec3 {
        const bNormalized = b.clone().normalize();
        const dotProduct = Vec3.dot(a, bNormalized);
        return bNormalized.multiplyScalar(dotProduct);
    }

    /**
     * Reflect vector across a normal
     */
    static reflect(vector: Vec3, normal: Vec3): Vec3 {
        const normalizedNormal = normal.clone().normalize();
        const dotProduct = Vec3.dot(vector, normalizedNormal);
        return vector.clone().add(normalizedNormal.multiplyScalar(-2 * dotProduct));
    }

    /**
     * Calculate distance squared (faster than distance for comparisons)
     */
    static distanceSquared(a: Vec3, b: Vec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Check if point is inside circle
     */
    static isPointInCircle(point: Vec3, center: Vec3, radius: number): boolean {
        return this.distanceSquared(point, center) <= radius * radius;
    }

    /**
     * Find closest point on line segment to a given point
     */
    static closestPointOnLineSegment(point: Vec3, lineStart: Vec3, lineEnd: Vec3): Vec3 {
        const lineVec = new Vec3();
        Vec3.subtract(lineVec, lineEnd, lineStart);
        const lineLength = lineVec.length();
        
        if (lineLength === 0) {
            return lineStart.clone();
        }
        
        lineVec.normalize();
        
        const pointVec = new Vec3();
        Vec3.subtract(pointVec, point, lineStart);
        
        const dot = Vec3.dot(pointVec, lineVec);
        const t = this.clamp(dot / lineLength, 0, 1);
        
        return lineStart.clone().add(lineVec.multiplyScalar(t * lineLength));
    }

    /**
     * Generate random point in circle
     */
    static randomPointInCircle(center: Vec3, radius: number): Vec3 {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * radius;
        return v3(
            center.x + Math.cos(angle) * r,
            center.y + Math.sin(angle) * r,
            center.z
        );
    }

    /**
     * Generate random point on circle edge
     */
    static randomPointOnCircle(center: Vec3, radius: number): Vec3 {
        const angle = Math.random() * Math.PI * 2;
        return v3(
            center.x + Math.cos(angle) * radius,
            center.y + Math.sin(angle) * radius,
            center.z
        );
    }

    /**
     * Smooth damp (similar to Unity's SmoothDamp)
     */
    static smoothDamp(current: number, target: number, velocity: { value: number }, smoothTime: number, deltaTime: number, maxSpeed: number = Infinity): number {
        smoothTime = Math.max(0.0001, smoothTime);
        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        
        let change = current - target;
        const originalTo = target;
        
        const maxChange = maxSpeed * smoothTime;
        change = this.clamp(change, -maxChange, maxChange);
        target = current - change;
        
        const temp = (velocity.value + omega * change) * deltaTime;
        velocity.value = (velocity.value - omega * temp) * exp;
        let output = target + (change + temp) * exp;
        
        if (originalTo - current > 0 === output > originalTo) {
            output = originalTo;
            velocity.value = (output - originalTo) / deltaTime;
        }
        
        return output;
    }

    /**
     * Smooth damp for Vec3
     */
    static smoothDampVec3(current: Vec3, target: Vec3, velocity: Vec3, smoothTime: number, deltaTime: number, maxSpeed: number = Infinity): Vec3 {
        const result = v3();
        const velocityX = { value: velocity.x };
        const velocityY = { value: velocity.y };
        const velocityZ = { value: velocity.z };
        
        result.x = this.smoothDamp(current.x, target.x, velocityX, smoothTime, deltaTime, maxSpeed);
        result.y = this.smoothDamp(current.y, target.y, velocityY, smoothTime, deltaTime, maxSpeed);
        result.z = this.smoothDamp(current.z, target.z, velocityZ, smoothTime, deltaTime, maxSpeed);
        
        velocity.x = velocityX.value;
        velocity.y = velocityY.value;
        velocity.z = velocityZ.value;
        
        return result;
    }

    /**
     * Convert angle in radians to degrees
     */
    static radToDeg(radians: number): number {
        return radians * 180 / Math.PI;
    }

    /**
     * Convert angle in degrees to radians
     */
    static degToRad(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    /**
     * Normalize angle to [-PI, PI] range
     */
    static normalizeAngle(angle: number): number {
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    }
}