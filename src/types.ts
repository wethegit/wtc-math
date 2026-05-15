export type Vec2Like = { x: number; y: number } | [number, number];
export type Vec3Like = { x: number; y: number; z: number } | [number, number, number];
export type Vec4Like = { x: number; y: number; z: number; w: number } | [number, number, number, number];
export type QuatLike = Vec4Like;
export type Mat2Like = { array: number[] } | number[];
export type Mat3Like = { array: number[] } | number[];
export type Mat4Like = { array: number[] } | number[];
