import { radianToDegrees, degreesToRadian } from './common';

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
   * @chainable
	 * @param {number} x 				The x coord
	 * @param {number} y 				The y coord
	 */
  constructor(...args:number[]){
    this.reset(...args);
  }

  /**
   * Resets the vector coordinates
   *
   * @public
   * @chainable
	 * @param {number|Array} x 	The x coord, OR the array to reset to
	 * @param {number} y 				The y coord
   */
	reset(...args:number[]):Vec2 {
    let [x,y] = args;
    if(isNaN(x)) x = 0;
    if(isNaN(y)) y = 0;
    this.x = x;
    this.y = y;
    return this;
  }
  
  /**
   * Resets the vector coordinates to another vector object
   *
   * @public
   * @chainable
	 * @param {Vector} v 				The vector object to use to reset the coordinates
   */
  resetToVector(v:Vec2):Vec2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

	/**
	 * Clones the vector
	 *
	 * @public
   * @chainable
	 * @return {Vector}					The cloned vector
	 */
  clone():Vec2 {
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
  add(vector:Vec2):Vec2 {
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
  addNew(vector:Vec2):Vec2 {
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
  addScalar(scalar:number):Vec2 {
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
  addScalarNew(scalar:number):Vec2 {
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
  subtract(vector:Vec2):Vec2 {
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
  subtractNew(vector:Vec2):Vec2 {
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
  subtractScalar(scalar:number):Vec2 {
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
  subtractScalarNew(scalar:number):Vec2 {
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
  divide(vector:Vec2):Vec2 {
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
  divideNew(vector:Vec2):Vec2 {
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
  divideScalar(scalar:number):Vec2 {
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
  divideScalarNew(scalar:number):Vec2 {
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
  multiply(vector:Vec2):Vec2 {
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
  multiplyNew(vector:Vec2):Vec2 {
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
  multiplyScalar(scalar:number):Vec2 {
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
  multiplyScalarNew(scalar:number):Vec2 {
    return this.clone().multiplyScalar(scalar);
  }

  /**
   * Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}
   */
  scale(scalar:number):Vec2 {
    return this.multiplyScalar(scalar);
  }
  /**
   * Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}
   */
  scaleNew(scalar:number):Vec2 {
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
  rotate(radian:number):Vec2 {
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
  rotateNew(radian:number):Vec2 {
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
  rotateDeg(degrees:number):Vec2 {
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
  rotateDegNew(degrees:number):Vec2 {
    return this.rotateNew(degreesToRadian(degrees));
  }

  /**
   * Alias of {@link Vector#rotate__anchor rotate}
   */
  rotateBy(radian:number):Vec2 {
		return this.rotate(radian);
  }
  /**
   * Alias of {@link Vector#rotateNew__anchor rotateNew}
   */
  rotateByNew(radian:number):Vec2 {
    return this.rotateNew(radian);
  }

  /**
   * Alias of {@link Vector#rotateDeg__anchor rotateDeg}
   */
  rotateDegBy(degrees:number):Vec2 {
		return this.rotateDeg(degrees);
  }
  /**
   * Alias of {@link Vector#rotateDegNew__anchor rotateDegNew}
   */
  rotateDegByNew(radian:number):Vec2 {
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
	rotateTo(radian:number):Vec2 {
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
	rotateToNew(radian:number):Vec2 {
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
  rotateToDeg(degrees:number):Vec2 {
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
  rotateToDegNew(degrees:number):Vec2 {
    return this.rotateToNew(degreesToRadian(degrees));
  }
  
	/**
	 * Negates the vector.
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
  negate():Vec2 {
    return this.multiplyScalar(-1.);
  }
  
	/**
	 * Clones the vector and negates it.
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
  negateNew():Vec2 {
    return this.multiplyScalarNew(-1.);
  }
  
	/**
	 * Inverses the vector.
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
  inverse():Vec2 {
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
  inverseNew():Vec2 {
    const c = this.clone();
    c.x = 1./c.x;
    c.y = 1./c.y;
    return c;
  }

	/**
	 * Normalises the vector down to a length of 1 unit
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns itself, modified
	 */
	normalise():Vec2 {
		return this.divideScalar(this.length);
	}
	/**
	 * Clones the vector and normalises it
	 *
	 * @public
	 * @chainable
	 * @return {Vec2}					Returns a clone of itself, modified
	 */
	normaliseNew():Vec2 {
		return this.divideScalarNew(this.length);
	}

	/**
	 * Calculates the distance between this and the supplied vector
	 *
	 * @param  {Vec2} vector The vector to calculate the distance from
	 * @return {number}        The distance between this and the supplied vector
	 */
	distance(vector:Vec2):number {
		return this.subtractNew(vector).length;
	}

	/**
	 * Calculates the distance on the X axis between this and the supplied vector
	 *
	 * @param  {Vec2} vector The vector to calculate the distance from
	 * @return {number}        The distance, along the x axis, between this and the supplied vector
	 */
	distanceX(vector:Vec2):number {
		return this.x - vector.x;
	}
  
	/**
	 * Calculated the distance on the Y axis between this and the supplied vector
	 *
	 * @param  {Vec2} vector The vector to calculate the distance from
	 * @return {number}        The distance, along the y axis, between this and the supplied vector
	 */
	distanceY(vector:Vec2):number {
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
	dot(vector:Vec2):number {
		return (this.x * vector.x) + (this.y * vector.y);
	}
  
	det(vector:Vec2):number {
		return (this.x * vector.y) + (this.y * vector.x);
	}
  
  slopeBetween(vector:Vec2):number {
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
	cross(vector:Vec2):number {
		return (this.x * vector.x) - (this.y * vector.y);
	}
  
  ceil():Vec2 {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }
  
  ceilNew():Vec2 {
    return this.clone().ceil();
  }
  
  floor():Vec2 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  
  floorNew():Vec2 {
    return this.clone().floor();
  }
  
  round():Vec2 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  
  roundNew():Vec2 {
    return this.clone().round();
  }
  
  mod(vector:Vec2):Vec2 {
    this.x = this.x % vector.x;
    this.y = this.y % vector.y;
    return this;
  }
  
  modNew(vector:Vec2):Vec2 {
    return this.clone().mod(vector);
  }
  
  fract():Vec2 {
    this.x -= Math.floor(this.x);
    this.y -= Math.floor(this.y);
    return this;
  }
  
  fractNew():Vec2 {
    return this.clone().fract();
  }
  
  transformByMat2(m):Vec2 {
    if(m.array) m = m.array; // This just transforms the matrix to an array.
    if(m instanceof Array && m.length >= 4) {
      const c = this.clone();
      this.x = m[0] * c.x + m[2] * c.y;
      this.y = m[1] * c.x + m[3] * c.y;
    }
    return this;
  }
  
  transformByMat2New(m):Vec2 {
    return this.clone().transformByMat2(m);
  }
  
  transformByMat3(m):Vec2 {
    if(m.array) m = m.array; // This just transforms the matrix to an array.
    if(m instanceof Array && m.length >= 9) {
      const c = this.clone();
      this.x = m[0] * c.x + m[3] * c.y + m[6];
      this.y = m[1] * c.x + m[4] * c.y + m[7];
    }
    return this;
  }
  
  transformByMat3New(m):Vec2 {
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
  #x: number = 0;
  set x(x:number) {
    if(typeof x == 'number') {
      this.#x = x;
    } else {
      throw new TypeError('X should be a number');
    }
  }
  get x():number {
    return this.#x || 0;
  }

 /**
	* (getter/setter) The y value of the vector.
	*
	* @type {number}
	* @default 0
	*/
  #y: number = 0;
  set y(y:number) {
    if(typeof y == 'number') {
      this.#y = y;
    } else {
      throw new TypeError('Y should be a number');
    }
  }
  get y():number {
    return this.#y || 0;
  }

	/**
	* (getter/setter) The length of the vector presented as a square. If you're using
	* length for comparison, this is quicker.
	*
	* @type {number}
	* @default 0
	*/
  set lengthSquared(length:number) {
    var factor;
    if(typeof length == 'number') {
      factor = length / this.lengthSquared;
      this.multiplyScalar(factor);
    } else {
      throw new TypeError('length should be a number');
    }
  }
  get lengthSquared():number {
    return (this.x * this.x) + (this.y * this.y);
  }

	/**
	* (getter/setter) The length of the vector
	*
	* @type {number}
	* @default 0
	*/
  set length(length:number) {
    var factor;
    if(typeof length == 'number') {
      factor = length / this.length;
      this.multiplyScalar(factor);
    } else {
      throw new TypeError('length should be a number');
    }
  }
  get length():number {
    return Math.sqrt(this.lengthSquared);
  }

	/**
	* (getter/setter) The angle of the vector, in radians
	*
	* @type {number}
	* @default 0
	*/
  set angle(radian:number) {
    if(typeof radian == 'number') {
      this.rotateTo(radian);
    } else {
      throw new TypeError('angle should be a number');
    }
  }
  get angle():number {
    return Math.atan2(this.y, this.x);
  }

	/**
	* (getter/setter) The angle of the vector, in radians
	*
	* @type {number}
	* @default 0
	*/
  set angleInDegrees(degrees:number) {
    if(typeof degrees == 'number') {
      this.rotateToDeg(degrees);
    } else {
      throw new TypeError('angle should be a number');
    }
  }
  get angleInDegrees():number {
    return radianToDegrees(Math.atan2(this.y, this.x));
  }

	/**
	 * (getter/setter) Vector width.
   * Alias of {@link Vector#x x}
	 *
	 * @type {number}
	 */
	set width(w:number) {
		this.x = w;
	}
	get width():number {
		return this.x;
	}

	/**
	 * (getter/setter) Vector height.
   * Alias of {@link Vector#x x}
	 *
	 * @type {number}
	 */
	set height(h:number) {
		this.y = h;
	}
	get height():number {
		return this.y;
	}

	/**
	 * (getter) Vector area.
	 * @readonly
	 *
	 * @type {number}
	 */
	get area():number {
		return this.x * this.y;
	}

	/**
	 * (getter/setter) Vector slope.
	 *
	 * @type {number}
	 */
  set slope(value:number) {
    if(!isNaN(value)) {
      let angle = Math.atan(value);
      this.angle = angle;
    }
  }
  get slope():number {
    return this.y / this.x;
  }

	/**
	 * (getter) Returns the basic array representation of this vector.
	 * @readonly
	 *
	 * @type {number}
	 */
  get array():number[] {
    return [this.x, this.y];
  }
  
	/**
	 * (getter/sette) Swizzle XY
	 *
	 * @type {number}
	 */
  get xy():Vec2|number[] {
    return new Vec2(this.x, this.y);
  }
  set xy(v:Vec2|number[]) {
    if(v instanceof Vec2) {
      this.resetToVector(v);
    } else if(v instanceof Array && v.length >= 2) {
      this.reset(v[0], v[1]);
    } else {
      throw new Error('input should be of type Vector');
    }
  }
  
	/**
	 * (getter/sette) Swizzle YX
	 *
	 * @type {number}
	 */
  get yx():any {
    return new Vec2(this.y, this.x);
  }
  set yx(v:any) {
    this.xy = Vec2.interpolate(v).yx;
  }
  
	/**
	 * (getter/sette) Swizzle XX
	 *
	 * @type {number}
	 */
  get xx():any {
    return new Vec2(this.x, this.x);
  }
  set xx(v:any) {
    v = Vec2.interpolate(v);
    this.x = v.y;
  }
  
	/**
	 * (getter/sette) Swizzle YY
	 *
	 * @type {number}
	 */
  get yy():any {
    return new Vec2(this.y, this.y);
  }
  set yy(v:any) {
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
  static interpolate(v:any) {
    if(v instanceof Vec2) {
      return new Vec2(v.x, v.y);
    } else if(v instanceof Array && v.length >= 2) {
      return new Vec2(v[0], v[1]);
    } else if(!isNaN(v)) {
      return new Vec2(v, v);
    } else if(typeof v === 'string') {
      const nv = v.split(',');
      const x:number = Number(nv[0]);
      const y:number = Number(nv[1]);
      if(nv.length >= 2 && !isNaN(x) && !isNaN(y)) {
        return new Vec2(x, y);
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
  static lerp(v1:Vec2, v2:Vec2, d:number):Vec2 {
    return new Vec2(
      v1.x + d * (v2.x - v1.x),
      v1.y + d * (v2.y - v1.y)
    );
  }
  
  /**
   * Finds the angle between 2 vectors.
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {number}
   */
  static getAngle(a:Vec2, b:Vec2):number {
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