const conversionFactor = 180 / Math.PI;

var radianToDegrees = function(radian) {
	return radian * conversionFactor;
}

var degreesToRadian = function(degrees) {
	return degrees / conversionFactor;
}

/**
 * A basic 2D Vector class that provides simple algebraic functionality in the form
 * of 2D Vectors.
 *
 * We use Getters/setters for both principle properties (x & y) as well as virtual
 * properties (rotation, length etc.).
 *
 * @class Vec2
 * @author Liam Egan <liam@wethecollective.com>
 * @version 1.0.0
 * @created Jan 07, 2020
 */
class Vec2 {

	/**
	 * The Vector Class constructor
	 *
	 * @constructor
	 * @param {number} x 				The x coord
	 * @param {number} y 				The y coord
	 */
  constructor(x, y){
    if(isNaN(x)) x = 0;
    if(isNaN(y)) y = 0;
    this.x = x;
    this.y = y;
  }

  /**
   * Resets the vector coordinates
   *
   * @public
	 * @param {number|Array} x 	The x coord, OR the array to reset to
	 * @param {number} y 				The y coord
   */
	reset(x, y) {
    if(x instanceof Array && x.length >= 2) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x;
      this.y = y;
    }
  }
  
  /**
   * Resets the vector coordinates to another vector object
   *
   * @public
	 * @param {Vector} v 				The vector object to use to reset the coordinates
   */
  resetToVector(v) {
    if(v instanceof Vec2) {
      this.x = v.x;
      this.y = v.y;
    }
  }

	/**
	 * Clones the vector
	 *
	 * @public
	 * @return {Vector}					The cloned vector
	 */
  clone() {
    return new Vec2(this.x, this.y);
  }

  /**
   * Adds one vector to another.
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to add to this one
   * @return {Vec2}					Returns itself, modified
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  /**
   * Clones the vector and adds the vector to it instead
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to add to this one
   * @return {Vec2}					Returns the clone of itself, modified
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
   * @return {Vec2}					Returns itself, modified
   */
  addScalar(scalar) {
    return this.add(new Vec2(scalar, scalar));
  }
  /**
   * Clones the vector and adds the scalar to it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec2}					Returns the clone of itself, modified
   */
  addScalarNew(scalar) {
    return this.clone().addScalar(scalar);
  }

  /**
   * Subtracts one vector from another.
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to subtract from this one
   * @return {Vec2}					Returns itself, modified
   */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  /**
   * Clones the vector and subtracts the vector from it instead
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to subtract from this one
   * @return {Vec2}					Returns the clone of itself, modified
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
   * @return {Vec2}					Returns itself, modified
   */
  subtractScalar(scalar) {
    return this.subtract(new Vec2(scalar, scalar));
  }
  /**
   * Clones the vector and subtracts the scalar from it instead
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to add to the vector
   * @return {Vec2}					Returns the clone of itself, modified
   */
  subtractScalarNew(scalar) {
    return this.clone().subtractScalar(scalar);
  }

  /**
   * Divides one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to divide this by
   * @return {Vec2}					Returns itself, modified
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
    return this;
  }
  /**
   * Clones the vector and divides it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to divide the clone by
   * @return {Vec2}					Returns the clone of itself, modified
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
   * @return {Vec2}					Returns itself, modified
   */
  divideScalar(scalar) {
    var v = new Vec2(scalar, scalar);
    return this.divide(v);
  }
  /**
   * Clones the vector and divides it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to divide both x and y by
   * @return {Vec2}					Returns the clone of itself, modified
   */
  divideScalarNew(scalar) {
    return this.clone().divideScalar(scalar);
  }

  /**
   * Multiplies one vector by another.
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to multiply this by
   * @return {Vec2}					Returns itself, modified
   */
  multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }
  /**
   * Clones the vector and multiplies it by the vector instead
   *
   * @public
   * @chainable
   * @param  {Vec2}  vector The vector to multiply the clone by
   * @return {Vec2}					Returns the clone of itself, modified
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
   * @return {Vec2}					Returns itself, modified
   */
  multiplyScalar(scalar) {
    var v = new Vec2(scalar, scalar);
    return this.multiply(v);
  }
  /**
   * Clones the vector and multiplies it by the provided scalar.
   *
   * @public
   * @chainable
   * @param  {number}  scalar The scalar to multiply both x and y by
   * @return {Vec2}					Returns the clone of itself, modified
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

  /**
   * Rotates a vecor by a given amount, provided in radians.
   *
   * @public
   * @chainable
   * @param  {number}  radian The angle, in radians, to rotate the vector by
   * @return {Vec2}					Returns itself, modified
   */
  rotate(radian) {
  	var x = (this.x * Math.cos(radian)) - (this.y * Math.sin(radian));
  	var y = (this.x * Math.sin(radian)) + (this.y * Math.cos(radian));

		this.x = x;
		this.y = y;

  	return this;
  }
  /**
   * Clones the vector and rotates it by the supplied radian value
   *
   * @public
   * @chainable
   * @param  {number}  radian The angle, in radians, to rotate the vector by
   * @return {Vec2}					Returns the clone of itself, modified
   */
  rotateNew(radian) {
    return this.clone().rotate(radian);
  }

	/**
	 * Rotates a vecor by a given amount, provided in degrees. Converts the degree
	 * value to radians and runs the rotaet method.
	 *
	 * @public
	 * @chainable
	 * @param  {number}  degrees The angle, in degrees, to rotate the vector by
	 * @return {Vec2}						Returns itself, modified
	 */
  rotateDeg(degrees) {
    return this.rotate(degreesToRadian(degrees));
  }
  /**
   * Clones the vector and rotates it by the supplied degree value
   *
   * @public
   * @chainable
	 * @param  {number}  degrees The angle, in degrees, to rotate the vector by
   * @return {Vec2}					 Returns the clone of itself, modified
   */
  rotateDegNew(degrees) {
    return this.rotateNew(degreesToRadian(degrees));
  }

  /**
   * Alias of {@link Vector#rotate__anchor rotate}
   */
  rotateBy(radian) {
		return this.rotate(radian);
  }
  /**
   * Alias of {@link Vector#rotateNew__anchor rotateNew}
   */
  rotateByNew(radian) {
    return this.rotateNew(radian);
  }

  /**
   * Alias of {@link Vector#rotateDeg__anchor rotateDeg}
   */
  rotateDegBy(degrees) {
		return this.rotateDeg(degrees);
  }
  /**
   * Alias of {@link Vector#rotateDegNew__anchor rotateDegNew}
   */
  rotateDegByNew(radian) {
    return this.rotateDegNew(radian);
  }

  /**
   * Rotates a vector to a specific angle
   *
   * @public
   * @chainable
   * @param  {number}  radian The angle, in radians, to rotate the vector to
   * @return {Vec2}					Returns itself, modified
   */
	rotateTo(radian) {
		return this.rotate(radian-this.angle);
	};
  /**
   * Clones the vector and rotates it to the supplied radian value
   *
   * @public
   * @chainable
   * @param  {number}  radian The angle, in radians, to rotate the vector to
   * @return {Vec2}					Returns the clone of itself, modified
   */
	rotateToNew(radian) {
    return this.clone().rotateTo(radian);
	};

	/**
	 * Rotates a vecor to a given amount, provided in degrees. Converts the degree
	 * value to radians and runs the rotateTo method.
	 *
	 * @public
	 * @chainable
	 * @param  {number}  degrees The angle, in degrees, to rotate the vector to
	 * @return {Vec2}						Returns itself, modified
	 */
  rotateToDeg(degrees) {
    return this.rotateTo(degreesToRadian(degrees));
  }
  /**
   * Clones the vector and rotates it to the supplied degree value
   *
   * @public
   * @chainable
	 * @param  {number}  degrees The angle, in degrees, to rotate the vector to
   * @return {Vec2}					 Returns the clone of itself, modified
   */
  rotateToDegNew(degrees) {
    return this.rotateToNew(degreesToRadian(degrees));
  }
  
	/**
	 * Negates the vector.
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
  negate() {
    return this.multiplyScalar(-1.);
  }
  
	/**
	 * Clones the vector and negates it.
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
  negateNew() {
    return this.multiplyScalarNew(-1.);
  }
  
	/**
	 * Inverses the vector.
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
  inverse() {
    this.x = 1./this.x;
    this.y = 1./this.y;
    return this;
  }
  
	/**
	 * Clones the vector and then inverses it.
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
  inverseNew() {
    const c = new Vector();
    c.x = 1./this.x;
    c.y = 1./this.y;
    return c;
  }

	/**
	 * Normalises the vector down to a length of 1 unit
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
	normalise() {
		return this.divideScalar(this.length);
	}
	/**
	 * Clones the vector and normalises it
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns a clone of itself, modified
	 */
	normaliseNew() {
		return this.divideScalarNew(this.length);
	}

	/**
	 * Calculates the distance between this and the supplied vector
	 *
	 * @param  {Vec2} vector The vector to calculate the distance from
	 * @return {number}        The distance between this and the supplied vector
	 */
	distance(vector) {
		return this.subtractNew(vector).length;
	}

	/**
	 * Calculates the distance on the X axis between this and the supplied vector
	 *
	 * @param  {Vec2} vector The vector to calculate the distance from
	 * @return {number}        The distance, along the x axis, between this and the supplied vector
	 */
	distanceX(vector) {
		return this.x - vector.x;
	}

	/**
	 * Calculated the distance on the Y axis between this and the supplied vector
	 *
	 * @param  {Vec2} vector The vector to calculate the distance from
	 * @return {number}        The distance, along the y axis, between this and the supplied vector
	 */
	distanceY(vector) {
		return this.y - vector.y;
	}


	/**
	 * Calculates the dot product between this and a supplied vectorT
	 *
	 * @example
	 * // returns -14
	 * new Vector(2, -3).dot(new Vector(-4, 2))
	 * new Vector(-4, 2).dot(new Vector(2, -3))
	 * new Vector(2, -4).dot(new Vector(-3, 2))
	 *
	 * @param  {Vec2} vector The vector object against which to calculate the dot product
	 * @return {number}        The dot product of the two vectors
	 */
	dot(vector) {
		return (this.x * vector.x) + (this.y * vector.y);
	}
  
	det(vector) {
		return (this.x * vector.y) + (this.y * vector.x);
	}
  
  slopeBetween(vector) {
    return (vector.y - this.y) / (vector.x - this.x);
  }

	/**
	 * Calculates the cross product between this and the supplied vector.
	 *
	 * @example
	 * // returns -2
	 * new Vector(2, -3).cross(new Vector(-4, 2))
	 * new Vector(-4, 2).cross(new Vector(2, -3))
	 * // returns 2
	 * new Vector(2, -4).cross(new Vector(-3, 2))
	 *
	 * @param  {Vec2} vector The vector object against which to calculate the cross product
	 * @return {number}        The cross product of the two vectors
	 */
	cross(vector) {
		return (this.x * vector.x) - (this.y * vector.y);
	}
  
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }
  
  ceilNew() {
    return this.clone().ceil();
  }
  
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  
  floorNew() {
    return this.clone().floor();
  }
  
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  
  roundNew() {
    return this.clone().round();
  }
  
  mod(vector) {
    this.x = this.x % vector.x;
    this.y = this.y % vector.y;
    return this;
  }
  
  modNew(vector) {
    return this.clone().mod(vector);
  }
  
  fract() {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    return this;
  }
  
  fractNew() {
    return this.clone().fract();
  }
  
  transformByMat2(m) {
    if(m.array) m = m.array; // This just transforms the matrix to an array.
    if(m instanceof Array && m.length >= 4) {
      const c = this.clone();
      this.x = m[0] * c.x + m[2] * c.y;
      this.y = m[1] * c.x + m[3] * c.y;
    }
    return this;
  }
  
  transformByMat2New(m) {
    return this.clone().transformByMat2(m);
  }
  
  transformByMat3(m) {
    if(m.array) m = m.array; // This just transforms the matrix to an array.
    if(m instanceof Array && m.length >= 9) {
      const c = this.clone();
      this.x = m[0] * c.x + m[3] * c.y + m[6];
      this.y = m[1] * c.x + m[4] * c.y + m[7];
    }
    return this;
  }
  
  transformByMat3New(m) {
    return this.clone().transformByMat3(m);
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
    return (this.x * this.x) + (this.y * this.y);
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
	* (getter/setter) The angle of the vector, in radians
	*
	* @type {number}
	* @default 0
	*/
  set angle(radian) {
    if(typeof radian == 'number') {
      this.rotateTo(radian);
    } else {
      throw new TypeError('angle should be a number');
    }
  }
  get angle() {
    return Math.atan2(this.y, this.x);
  }

	/**
	* (getter/setter) The angle of the vector, in radians
	*
	* @type {number}
	* @default 0
	*/
  set angleInDegrees(degrees) {
    if(typeof degrees == 'number') {
      this.rotateToDeg(degrees);
    } else {
      throw new TypeError('angle should be a number');
    }
  }
  get angleInDegrees() {
    return radianToDegrees(Math.atan2(this.y, this.x));
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
	 * (getter) Vector area.
	 * @readonly
	 *
	 * @type {number}
	 */
	get area() {
		return this.x * this.y;
	}

	/**
	 * (getter/setter) Vector slope.
	 *
	 * @type {number}
	 */
  set slope(value) {
    if(!isNaN(value)) {
      let angle = Math.atan(value);
      this.angle = angle;
    }
  }
  get slope() {
    return this.y / this.x;
  }

	/**
	 * (getter) Returns the basic array representation of this vector.
	 * @readonly
	 *
	 * @type {number}
	 */
  get array() {
    return [this.x, this.y];
  }
  
	/**
	 * (getter/sette) Swizzle XY
	 *
	 * @type {number}
	 */
  get xy() {
    return new Vec2(this.x, this.y);
  }
  set xy(v) {
    if(v instanceof Vec2) {
      this.resetToVector(v);
    } else if(v instanceof Array && v.length >= 2) {
      this.reset(v);
    } else {
      throw new Error('input should be of type Vector');
    }
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
    this.xy = Vec2.interpolate(v).yx;
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
   * Static methods
   */
  /**
   * Iterpolates a provided anonymous value into a vew Vec2
   *
   * @param {Vec2|array|string|number} v The value to interpolate
   * @returns {Vec2} out
   */
  static interpolate(v) {
    if(v instanceof Vec2) {
      return new Vec2(v.x, v.y);
    } else if(v instanceof Array && v.length >= 2) {
      return new Vec2(v[0], v[1]);
    } else if(!isNaN(v)) {
      return new Vec2(v, v);
    } else if(typeof v === 'string') {
      const nv = v.split(',');
      if(nv.length >= 2 && !isNaN(nv[0]) && !isNaN(nv[1])) {
        return new Vec2(Number(nv[0], nv[1]));
      }
    } else {
      throw new Error('The passed interpolant could not be parsed into a vec2');
    }
  }
  
  /**
   * Performs a linear interpolation between two vec2's
   *
   * @param {vec2} v1 the first operand
   * @param {vec2} v2 the second operand
   * @param {Number} d interpolation amount in the range of 0 - 1
   * @returns {Vec2}
   */
  static lerp(v1, v2, d) {
    return new Vec2(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y)
    );
  }
  
  static getAngle(a, b) {
    a = a.clone();
    b = b.clone();
    
    a.normalise();
    b.normalise();

    const cosine = a.dot(b);

    if(cosine > 1.0) {
      return 0;
    }
    else if(cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  }

}
export default Vec2;