// Basic types for Cocos Creator simulation
export interface Vec3Like {
    x: number;
    y: number;
    z: number;
}

export class Vec3 implements Vec3Like {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x: number, y: number, z: number): Vec3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    lengthSqr(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    normalize(): Vec3 {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }

    multiplyScalar(scalar: number): Vec3 {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    add(other: Vec3): Vec3 {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    static dot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    static subtract(out: Vec3, a: Vec3, b: Vec3): void {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
    }

    static distance(a: Vec3, b: Vec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

export function v3(x: number = 0, y: number = 0, z: number = 0): Vec3 {
    return new Vec3(x, y, z);
}

// Mock classes for compilation
export class Component {
    public node: any = {
        worldPosition: new Vec3(),
        scene: null,
        setWorldPosition: (pos: Vec3) => { this.node.worldPosition = pos; },
        addChild: () => {},
        name: "MockNode",
        angle: 0
    };
}

export class Node {
    public name: string = "";
    public worldPosition: Vec3 = new Vec3();
    public angle: number = 0;

    constructor(name: string = "") {
        this.name = name;
    }

    setWorldPosition(pos: Vec3): void {
        this.worldPosition = pos.clone();
    }

    addChild(child: Node): void {
        // Mock implementation
    }

    addComponent(componentClass: any): any {
        return new componentClass();
    }

    getComponent(componentClass: any): any {
        return null;
    }

    walk(callback: (node: Node) => void): void {
        // Mock implementation
    }
}

export const _decorator = {
    ccclass: (name: string) => (target: any) => target,
    property: (...args: any[]) => (target: any, key?: string) => {}
};

// Mock additional classes
export class Color {
    static RED = { r: 255, g: 0, b: 0, a: 255 };
    static WHITE = { r: 255, g: 255, b: 255, a: 255 };
    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {}
}

export class Graphics {
    fillColor: any = null;
    strokeColor: any = null;
    lineWidth: number = 1;
    
    circle(x: number, y: number, radius: number) {}
    rect(x: number, y: number, width: number, height: number) {}
    fill() {}
    stroke() {}
    moveTo(x: number, y: number) {}
    lineTo(x: number, y: number) {}
}

export class UITransform {
    setContentSize(width: number, height: number) {}
}

export class Prefab {}

export function instantiate(prefab: Prefab): Node {
    return new Node();
}