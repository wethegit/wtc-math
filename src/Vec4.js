import Vec2 from './Vec2';
import Vec3 from './Vec3';

const conversionFactor = 180 / Math.PI;

var radianToDegrees = function(radian) {
	return radian * conversionFactor;
}

var degreesToRadian = function(degrees) {
	return degrees / conversionFactor;
}

/**
 * A basic 3D Vector class that provides simple algebraic functionality in the form
 * of 3D Vectors.
 *
 * We use Getters/setters for both principle properties (x & y) as well as virtual
 * properties (rotation, length etc.).
 *
 * @class Vec4
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */
class Vec4 {

	/**
	 * The Vector Class constructor
	 *
	 * @constructor
	 * @param {number} x 				The x coord
	 * @param {number} y 				The y coord
	 */
  constructor(x, y, z, w){
    if(isNaN(x)) x = 0;
    if(isNaN(y)) y = 0;
    if(isNaN(z)) z = 0;
    if(isNaN(w)) w = 0;
    this.reset(x, y, z, w);
  }

  /**
   * Resets the vector coordinates
   *
   * @public
	 * @param {number|Array} x 	The x coord, OR the array to reset to
	 * @param {number} y 				The y coord
   */
	reset(x, y, z, w) {
    if(x instanceof Array && x.length >= 4) {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
      this.w = x[3];
    } else {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
  }
  
  /**
   * Resets the vector coordinates to another vector object
   *
   * @public
	 * @param {Vector} v 				The vector object to use to reset the coordinates
   */
  resetToVector(v) {
    if(v instanceof Vec4) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w;
    }
  }

	/**
	 * Clones the vector
	 *
	 * @public
	 * @return {Vec4}					The cloned vector
	 */
  clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  /**
   * Adds one vector to another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to add to this one
   * @return {Vec4}					Returns itself, modified
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;
    return this;
  }
  /**
   * Clones the vector and adds the vector to it instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to add to this one
   * @return {Vec4}					Returns the clone of itself, modified
   */
  addNew(vector) {
    return this.clone().add(vector);
  }

  /**
   * Adds a scalar to the vector, modifying both the x and y
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec4}					Returns itself, modified
   */
  addScalar(scalar) {
    return this.add(new Vec4(scalar, scalar, scalar, scalar));
  }
  /**
   * Clones the vector and adds the scalar to it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec4}					Returns the clone of itself, modified
   */
  addScalarNew(scalar) {
    return this.clone().addScalar(scalar);
  }

  /**
   * Subtracts one vector from another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to subtract from this one
   * @return {Vec4}					Returns itself, modified
   */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    this.w -= vector.w;
    return this;
  }
  /**
   * Clones the vector and subtracts the vector from it instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to subtract from this one
   * @return {Vec4}					Returns the clone of itself, modified
   */
  subtractNew(vector) {
    return this.clone().subtract(vector);
  }

  /**
   * Subtracts a scalar from the vector, modifying both the x and y
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to subtract from the vector
   * @return {Vec4}					Returns itself, modified
   */
  subtractScalar(scalar) {
    return this.subtract(new Vec4(scalar, scalar, scalar, scalar));
  }
  /**
   * Clones the vector and subtracts the scalar from it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec4}					Returns the clone of itself, modified
   */
  subtractScalarNew(scalar) {
    return this.clone().subtractScalar(scalar);
  }

  /**
   * Divides one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to divide this by
   * @return {Vec4}					Returns itself, modified
   */
  divide(vector) {
    if(vector.x !== 0) {
      this.x /= vector.x
    } else {
      this.x = 0;
    }
    if(vector.y !== 0) {
      this.y /= vector.y
    } else {
      this.y = 0;
    }
    if(vector.z !== 0) {
      this.z /= vector.z;
    } else {
      this.z = 0;
    }
    if(vector.w !== 0) {
      this.w /= vector.w;
    } else {
      this.w = 0;
    }
    return this;
  }
  /**
   * Clones the vector and divides it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to divide the clone by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  divideNew(vector) {
    return this.clone().divide(vector);
  }

  /**
   * Divides the vector by a scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to divide both x and y by
   * @return {Vec4}					Returns itself, modified
   */
  divideScalar(scalar) {
    var v = new Vec4(scalar, scalar, scalar, scalar);
    return this.divide(v);
  }
  /**
   * Clones the vector and divides it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to divide both x and y by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  divideScalarNew(scalar) {
    return this.clone().divideScalar(scalar);
  }

  /**
   * Multiplies one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to multiply this by
   * @return {Vec4}					Returns itself, modified
   */
  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;
    return this;
  }
  /**
   * Clones the vector and multiplies it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec4}  vector The vector to multiply the clone by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  multiplyNew(vector) {
    return this.clone().multiply(vector);
  }

  /**
   * Multiplies the vector by a scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to multiply both x and y by
   * @return {Vec4}					Returns itself, modified
   */
  multiplyScalar(scalar) {
    var v = new Vec4(scalar, scalar, scalar, scalar);
    return this.multiply(v);
  }
  /**
   * Clones the vector and multiplies it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to multiply both x and y by
   * @return {Vec4}					Returns the clone of itself, modified
   */
  multiplyScalarNew(scalar) {
    return this.clone().multiplyScalar(scalar);
  }

  /**
   * Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}
   */
  scale(scalar) {
    return this.multiplyScalar(scalar);
  }
  /**
   * Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}
   */
  scaleNew(scalar) {
    return this.multiplyScalarNew(scalar);
  }

  rotateX(origin, radian) {
    
    const s = Math.sin(radian);
    const c = Math.cos(radian);
    
    // Translate to the origin
    const translated = this.subtractNew(origin);
    
    // Rotate
    const rotated = translated.clone();
    rotated.y = rotated.y * c - rotated.z * s;
    rotated.z = rotated.y * s + rotated.z * c;

    // Translate back
		this.y = rotated.y + origin.y;
    this.z = rotated.z + origin.z;

  	return this;
  }
  
  rotateXNew(radian) {
    return this.clone().rotateX(radian);
  }

  rotateY(origin, radian) {
    
    const s = Math.sin(radian);
    const c = Math.cos(radian);
    
    // Translate to the origin
    const translated = this.subtractNew(origin);
    
    // Rotate
    const rotated = translated.clone();
    rotated.x = rotated.z * s + rotated.z * c;
    rotated.z = rotated.z * c - rotated.x * s;

    // Translate back
		this.x = rotated.x + origin.x;
    this.z = rotated.z + origin.z;

  	return this;
  }
  
  rotateyNew(radian) {
    return this.clone().rotateY(radian);
  }

  rotateZ(origin, radian) {
    
    const s = Math.sin(radian);
    const c = Math.cos(radian);
    
    // Translate to the origin
    const translated = this.subtractNew(origin);
    
    // Rotate
    const rotated = translated.clone();
    rotated.x = rotated.x * c - rotated.y * s;
    rotated.y = rotated.x * s + rotated.y * c;

    // Translate back
		this.x = rotated.x + origin.x;
    this.y = rotated.y + origin.y;

  	return this;
  }
  
  rotateZNew(radian) {
    return this.clone().rotateZ(radian);
  }
  
  transformByMat4(m) {
    if(m.array) m = m.array; // This just transforms the matrix to an array.
    if(m instanceof Array && m.length >= 16) {
      const o = this.clone();
      this.x = ( m[0] * o.x + m[4] * o.y + m[8] * o.z + m[12] ) / this.w;
      this.y = ( m[1] * o.x + m[5] * o.y + m[9] * o.z + m[13] ) / this.w;
      this.z = ( m[2] * o.x + m[6] * o.y + m[10] * o.z + m[14] ) / this.w;
      this.w = ( m[3] * o.x + m[7] * o.y + m[11] * o.z + m[15] ) / this.w;
    }
    return this;
  }
  
  transformByMat4New(m) {
    return this.clone().transformByMat4(m);
  }
  
  transformByQuat(q) {
    if(q.array) q = q.array; // This just transforms the quaternion to an array.
    if(q instanceof Array && q.length >= 4) {
      const uv = new Vec4(
        q.w * this.x + q.y * this.z - q.z * this.y,
        q.w * this.y + q.z * this.x - q.x * this.z,
        q.w * this.z + q.x * this.y - q.y * this.x,
        -q.x * this.x - q.y * this.y - q.z * this.z
      );
      
      this.x = uv.x * q.w + uv.w * -q.x + uv.y * -q.z - uv.z * -q.y;
      this.y = uv.y * q.w + uv.w * -q.y + uv.z * -q.x - uv.x * -q.z;
      this.z = uv.z * q.w + uv.w * -q.z + uv.x * -q.y - uv.y * -q.x;
    }
    return this;
  }
  
  transformByQuatNew(q) {
    return this.clone().transformByQuat(q);
  }
  
	/**
	 * Negates the vector.
	 *
	 * @public
	 * @chainable
	 * @return {Vec4}					Returns itself, modified
	 */
  negate() {
    return this.multiplyScalar(-1.);
  }
  
	/**
	 * Clones the vector and negates it.
	 *
	 * @public
	 * @chainable
	 * @return {Vec4}					Returns itself, modified
	 */
  negateNew() {
    return this.multiplyScalarNew(-1.);
  }
  
	/**
	 * Inverses the vector.
	 *
	 * @public
	 * @chainable
	 * @return {Vec4}					Returns itself, modified
	 */
  inverse() {
    this.x = 1./this.x;
    this.y = 1./this.y;
    this.z = 1./this.z;
    this.w = 1./this.w;
    return this;
  }
  
	/**
	 * Clones the vector and then inverses it.
	 *
	 * @public
	 * @chainable
	 * @return {Vec4}					Returns itself, modified
	 */
  inverseNew() {
    const c = new Vector();
    c.x = 1./this.x;
    c.y = 1./this.y;
    c.z = 1./this.z;
    c.w = 1./this.w;
    return c;
  }

	/**
	 * Normalises the vector down to a length of 1 unit
	 *
	 * @public
	 * @chainable
	 * @return {Vec4}					Returns itself, modified
	 */
	normalise() {
    const l = this.length;
    if(l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      this.divideScalar(l)
    }
		return this;
	}
	/**
	 * Clones the vector and normalises it
	 *
	 * @public
	 * @chainable
	 * @return {Vec4}					Returns a clone of itself, modified
	 */
	normaliseNew() {
		return this.clone().normalise();
	}

	/**
	 * Calculates the distance between this and the supplied vector
	 *
	 * @param  {Vec4} vector The vector to calculate the distance from
	 * @return {number}        The distance between this and the supplied vector
	 */
	distance(vector) {
		return this.subtractNew(vector).length;
	}

	/**
	 * Calculates the distance on the X axis between this and the supplied vector
	 *
	 * @param  {Vec4} vector The vector to calculate the distance from
	 * @return {number}        The distance, along the x axis, between this and the supplied vector
	 */
	distanceX(vector) {
		return this.x - vector.x;
	}

	/**
	 * Calculated the distance on the Y axis between this and the supplied vector
	 *
	 * @param  {Vec4} vector The vector to calculate the distance from
	 * @return {number}        The distance, along the y axis, between this and the supplied vector
	 */
	distanceY(vector) {
		return this.y - vector.y;
	}

	/**
	 * Calculated the distance on the Z axis between this and the supplied vector
	 *
	 * @param  {Vec4} vector The vector to calculate the distance from
	 * @return {number}        The distance, along the y axis, between this and the supplied vector
	 */
	distanceZ(vector) {
		return this.z - vector.z;
	}


	/**
	 * Calculates the dot product between this and a supplied vector
	 *
	 * @example
	 * // returns -14
	 * new Vector(2, -3).dot(new Vector(-4, 2))
	 * new Vector(-4, 2).dot(new Vector(2, -3))
	 * new Vector(2, -4).dot(new Vector(-3, 2))
	 *
	 * @param  {Vec4} vector The vector object against which to calculate the dot product
	 * @return {number}        The dot product of the two vectors
	 */
	dot(vector) {
		return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z) + (this.w * vector.w);
	}

	/**
	 * Calculates the cross product between this and two other supplied vectors
	 *
	 * @example
	 * // returns -2
	 * new Vector(2, -3).cross(new Vector(-4, 2))
	 * new Vector(-4, 2).cross(new Vector(2, -3))
	 * // returns 2
	 * new Vector(2, -4).cross(new Vector(-3, 2))
	 *
	 * @param  {Vec4} vector The vector object against which to calculate the cross product
	 * @return {Vec4}        The cross product of the two vectors
	 */
	cross(v, w) {
    const u = this.clone();
    
    const A = (v[0] * w[1]) - (v[1] * w[0]),
          B = (v[0] * w[2]) - (v[2] * w[0]),
          C = (v[0] * w[3]) - (v[3] * w[0]),
          D = (v[1] * w[2]) - (v[2] * w[1]),
          E = (v[1] * w[3]) - (v[3] * w[1]),
          F = (v[2] * w[3]) - (v[3] * w[2]),
          G = u[0],
          H = u[1],
          I = u[2],
          J = u[3];
    
    return new Vec4(
      (H * F) - (I * E) + (J * D),
      -(G * F) + (I * C) - (J * B),
      (G * E) - (H * C) + (J * A),
      -(G * D) + (H * B) - (I * A)
    );
	}
  
  crossNew() {
    this.clone().cross();
  }
  
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    this.w = Math.ceil(this.w);
    return this;
  }
  
  ceilNew() {
    return this.clone().ceil();
  }
  
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    this.w = Math.floor(this.w);
    return this;
  }
  
  floorNew() {
    return this.clone().floor();
  }
  
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    this.w = Math.round(this.w);
    return this;
  }
  
  roundNew() {
    return this.clone().round();
  }
  
  fract() {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    this.z -= Math.floor(this.z);
    this.w -= Math.floor(this.w);
    return this;
  }
  
  fractNew() {
    return this.clone().fract();
  }


  /**
   * Getters and setters
   */

  /**
   * (getter/setter) The x value of the vector.
   *
   * @type {number}
   * @default 0
   */
  set x(x) {
    if(typeof x == 'number') {
      this._x = x;
    } else {
      throw new TypeError('X should be a number');
    }
  }
  get x() {
    return this._x || 0;
  }

 /**
	* (getter/setter) The y value of the vector.
	*
	* @type {number}
	* @default 0
	*/
  set y(y) {
    if(typeof y == 'number') {
      this._y = y;
    } else {
      throw new TypeError('Y should be a number');
    }
  }
  get y() {
    return this._y || 0;
  }

 /**
	* (getter/setter) The y value of the vector.
	*
	* @type {number}
	* @default 0
	*/
  set z(z) {
    if(typeof z == 'number') {
      this._z = z;
    } else {
      throw new TypeError('Y should be a number');
    }
  }
  get z() {
    return this._z || 0;
  }

 /**
	* (getter/setter) The y value of the vector.
	*
	* @type {number}
	* @default 0
	*/
  set w(w) {
    if(typeof w == 'number') {
      this._w = w;
    } else {
      throw new TypeError('W should be a number');
    }
  }
  get w() {
    return this._w || 0;
  }

	/**
	* (getter/setter) The length of the vector presented as a square. If you're using
	* length for comparison, this is quicker.
	*
	* @type {number}
	* @default 0
	*/
  set lengthSquared(length) {
    var factor;
    if(typeof length == 'number') {
      factor = length / this.lengthSquared;
      this.multiplyScalar(factor);
    } else {
      throw new TypeError('length should be a number');
    }
  }
  get lengthSquared() {
    return (this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w);
  }

	/**
	* (getter/setter) The length of the vector
	*
	* @type {number}
	* @default 0
	*/
  set length(length) {
    var factor;
    if(typeof length == 'number') {
      factor = length / this.length;
      this.multiplyScalar(factor);
    } else {
      throw new TypeError('length should be a number');
    }
  }
  get length() {
    return Math.sqrt(this.lengthSquared);
  }

	/**
	 * (getter/setter) Vector width.
   * Alias of {@link Vector#x x}
	 *
	 * @type {number}
	 */
	set width(w) {
		this.x = w;
	}
	get width() {
		return this.x;
	}

	/**
	 * (getter/setter) Vector height.
   * Alias of {@link Vector#x x}
	 *
	 * @type {number}
	 */
	set height(h) {
		this.y = h;
	}
	get height() {
		return this.y;
	}

	/**
	 * (getter/setter) Vector height.
   * Alias of {@link Vector#x x}
	 *
	 * @type {number}
	 */
	set depth(h) {
		this.z = h;
	}
	get depth() {
		return this.z;
	}

	/**
	 * (getter) Vector area.
	 * @readonly
	 *
	 * @type {number}
	 */
	get area() {
		return this.x * this.y * this.z * this.w;
	}

	/**
	 * (getter) Returns the basic array representation of this vector.
	 * @readonly
	 *
	 * @type {number}
	 */
  get array() {
    return [this.x, this.y, this.z, this.w];
  }
  
	/**
	 * (getter/sette) Swizzle XYZW
	 *
	 * @type {Vec4}
	 */
  get xyzw() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
  set xyzw(v) {
    if(v instanceof Vec4) {
      this.resetToVector(v);
    } else if(v instanceof Array && v.length >= 4) {
      this.reset(v);
    } else {
      throw new Error('input should be of type Vector');
    }
  }
  
	/**
	 * (getter/sette) Swizzle XYZW
	 *
	 * @type {Vec4}
	 */
  get yzwx() {
    return new Vec4(this.y, this.z, this.w, this.x);
  }
  set yzwx(v) {
    this.xyzw = Vec4.interpolate(v).yzwx;
  }
  
	/**
	 * (getter/sette) Swizzle XYZW
	 *
	 * @type {Vec4}
	 */
  get zwxy() {
    return new Vec4(this.z, this.w, this.x, this.y);
  }
  set zwxy(v) {
    this.xyzw = Vec4.interpolate(v).zwxy;
  }
  
	/**
	 * (getter/sette) Swizzle XYZW
	 *
	 * @type {Vec4}
	 */
  get wxyz() {
    return new Vec4(this.w, this.x, this.y, this.z);
  }
  set wxyz(v) {
    this.xyzw = Vec4.interpolate(v).wxyz;
  }
  
  // I'm skipping all the silly combinations of 4 here because they're largely useless
  
	/**
	 * (getter/sette) Swizzle YZX
	 *
	 * @type {Vec3}
	 */
  get xyz() {
    return new Vec3(this.x, this.y, this.z);
  }
  set xyz(v) {
    v = Vec3.interpolate(v);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
  }
  
	/**
	 * (getter/sette) Swizzle YZX
	 *
	 * @type {Vec3}
	 */
  get yzx() {
    return new Vec3(this.y, this.z, this.x);
  }
  set yzx(v) {
    v = Vec3.interpolate(v);
    this.x = v.y;
    this.y = v.z;
    this.z = v.x;
  }
  
	/**
	 * (getter/sette) Swizzle ZXY
	 *
	 * @type {Vec3}
	 */
  get zxy() {
    return new Vec3(this.z, this.x, this.y);
  }
  set zxy(v) {
    v = Vec3.interpolate(v);
    this.x = v.z;
    this.y = v.x;
    this.z = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle XX
	 *
	 * @type {number}
	 */
  get xx() {
    return new Vec2(this.x, this.x);
  }
  set xx(v) {
    v = Vec2.interpolate(v);
    this.x = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle XY
	 *
	 * @type {Vec2}
	 */
  get xy() {
    return new Vec2(this.x, this.y);
  }
  set xy(v) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.y = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle XY
	 *
	 * @type {Vec2}
	 */
  get xz() {
    return new Vec2(this.x, this.z);
  }
  set xz(v) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.z = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle XY
	 *
	 * @type {Vec2}
	 */
  get xw() {
    return new Vec2(this.x, this.w);
  }
  set xw(v) {
    v = Vec2.interpolate(v);
    this.x = v.x;
    this.z = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle YX
	 *
	 * @type {number}
	 */
  get yx() {
    return new Vec2(this.y, this.x);
  }
  set yx(v) {
    v = Vec2.interpolate(v);
    this.x = v.y;
    this.y = v.x;
  }
  
	/**
	 * (getter/sette) Swizzle YY
	 *
	 * @type {number}
	 */
  get yy() {
    return new Vec2(this.y, this.y);
  }
  set yy(v) {
    v = Vec2.interpolate(v);
    this.y = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle YZ
	 *
	 * @type {Vec2}
	 */
  get yz() {
    return new Vec2(this.y, this.z);
  }
  set yz(v) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.z = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle YZ
	 *
	 * @type {Vec2}
	 */
  get yw() {
    return new Vec2(this.y, this.w);
  }
  set yw(v) {
    v = Vec2.interpolate(v);
    this.y = v.x;
    this.w = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle zx
	 *
	 * @type {Vec2}
	 */
  get zx() {
    return new Vec2(this.z, this.x);
  }
  set zx(v) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.x = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle ZY
	 *
	 * @type {number}
	 */
  get zy() {
    return new Vec2(this.z, this.y);
  }
  set zy(v) {
    v = Vec2.interpolate(v);
    this.z = v.y;
    this.y = v.x;
  }
  
	/**
	 * (getter/sette) Swizzle ZZ
	 *
	 * @type {number}
	 */
  get zz() {
    return new Vec2(this.z, this.z);
  }
  set zz(v) {
    v = Vec2.interpolate(v);
    this.z = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle XY
	 *
	 * @type {Vec2}
	 */
  get zw() {
    return new Vec2(this.z, this.w);
  }
  set zw(v) {
    v = Vec2.interpolate(v);
    this.z = v.x;
    this.w = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle wx
	 *
	 * @type {Vec2}
	 */
  get wx() {
    return new Vec2(this.w, this.x);
  }
  set wx(v) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.x = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle WY
	 *
	 * @type {number}
	 */
  get wy() {
    return new Vec2(this.w, this.y);
  }
  set wy(v) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.y = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle WZ
	 *
	 * @type {number}
	 */
  get wz() {
    return new Vec2(this.w, this.z);
  }
  set wz(v) {
    v = Vec2.interpolate(v);
    this.w = v.x;
    this.z = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle WW
	 *
	 * @type {Vec2}
	 */
  get ww() {
    return new Vec2(this.w, this.w);
  }
  set ww(v) {
    v = Vec2.interpolate(v);
    this.w = v.y;
  }


  /**
   * Static methods
   */
  
  /**
   * Iterpolates a provided anonymous value into a vew Vec4
   *
   * @param {Vec4|array|string|number} v The value to interpolate
   * @returns {Vec4} out
   */
  static interpolate(v) {
    if(v instanceof Vec4) {
      return new Vec4(v.x, v.y, v.z, v.w);
    } else if(v instanceof Array && v.length >= 4) {
      return new Vec4(v[0], v[1], v[2], v[3]);
    } else if(!isNaN(v)) {
      return new Vec4(v, v, v, v);
    } else if(typeof v === 'string') {
      const nv = v.split(',');
      if(nv.length >= 3 && !isNaN(nv[0]) && !isNaN(nv[1]) && !isNaN(nv[2]) && !isNaN(nv[3])) {
        return new Vec4(Number(nv[0], nv[1], nv[2], nv[3]));
      }
    } else {
      throw new Error('The passed interpolant could not be parsed into a Vec4');
    }
  }
  
  /**
   * Performs a linear interpolation between two Vec4's
   *
   * @param {Vec4} v1 the first operand
   * @param {Vec4} v2 the second operand
   * @param {Number} d interpolation amount in the range of 0 - 1
   * @returns {Vec4}
   */
  static lerp(v1, v2, d) {
    return new Vec4(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y),
      v1.z + d * (v2.z - v1.z),
      v1.w + d * (v2.w - v1.w)
    );
  }
  
  static getAngle(a, b) {
    let dotproduct = a.dot(b);

    return Math.acos(2 * dotproduct*dotproduct - 1);
  }

}

export default Vec4;
