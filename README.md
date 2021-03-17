# [wtc-math](https://github.com/wethegit/wtc-math#readme) *0.1.5*

> A math library that provides discrete components for common math operations. Includes vectors, matrices and quaternions.


### src/Mat2.js


#### adjoint(out, a) 

Calculates the adjugate of a mat2




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| out | `mat2`  | the receiving matrix | &nbsp; |
| a | `mat2`  | the source matrix | &nbsp; |




##### Returns


- `mat2`  out



#### a11() 

(getter/setter) The a11 value of the matrix.






##### Returns


- `Void`



#### a12() 

(getter/setter) The a12 value of the matrix.






##### Returns


- `Void`



#### a21() 

(getter/setter) The a21 value of the matrix.






##### Returns


- `Void`



#### a22() 

(getter/setter) The a22 value of the matrix.






##### Returns


- `Void`



#### array() 

(getter) Returns the basic array representation of this matrix.






##### Returns


- `Void`



#### columnArray() 

(getter) Returns the basic array representation of this matrix.
this returns the array in column-major form.






##### Returns


- `Void`




### src/Mat3.js


#### a11() 

(getter/setter) The a11 value of the matrix.






##### Returns


- `Void`



#### a12() 

(getter/setter) The a12 value of the matrix.






##### Returns


- `Void`



#### a13() 

(getter/setter) The a13 value of the matrix.






##### Returns


- `Void`



#### a21() 

(getter/setter) The a21 value of the matrix.






##### Returns


- `Void`



#### a22() 

(getter/setter) The a22 value of the matrix.






##### Returns


- `Void`



#### a23() 

(getter/setter) The a23 value of the matrix.






##### Returns


- `Void`



#### a31() 

(getter/setter) The a31 value of the matrix.






##### Returns


- `Void`



#### a32() 

(getter/setter) The a32 value of the matrix.






##### Returns


- `Void`



#### a33() 

(getter/setter) The a33 value of the matrix.






##### Returns


- `Void`



#### array() 

(getter) Returns the basic array representation of this matrix.






##### Returns


- `Void`



#### columnArray() 

(getter) Returns the basic array representation of this matrix.
this returns the array in column-major form.






##### Returns


- `Void`



#### determinant(a) 

Calculates the determinant of a mat3




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| a | `mat3`  | the source matrix | &nbsp; |




##### Returns


- `Number`  determinant of a



#### fromMat4(a) 

Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| a | `mat4`  | Mat4 to derive the normal matrix from | &nbsp; |




##### Returns


- `mat3`  



#### fromProjection(width, height) 

Generates a 2D projection matrix with the given bounds




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| width | `number`  | Width of your gl context | &nbsp; |
| height | `number`  | Height of gl context | &nbsp; |




##### Returns


- `mat3`  out




### src/Mat4.js


#### transform(v) 

Transforms the mat4 by a given amount




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vec3`  | The amount to add to the matrixes transformation properties | &nbsp; |




##### Returns


- `mat4`  output



#### transformTo(v) 

Transforms the mat4 to a given position




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vec3`  | The amount to add to the matrixes transformation properties | &nbsp; |




##### Returns


- `mat4`  output



#### rotate(r, axis) 

Rotates a mat4 by the given angle around the given axis




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| r | `Number`  | the angle to rotate the matrix by | &nbsp; |
| axis | `vec3`  | the axis to rotate around | &nbsp; |




##### Returns


- `mat4`  output



#### a11() 

(getter/setter) The a11 value of the matrix.






##### Returns


- `Void`



#### a12() 

(getter/setter) The a12 value of the matrix.






##### Returns


- `Void`



#### a13() 

(getter/setter) The a13 value of the matrix.






##### Returns


- `Void`



#### a14() 

(getter/setter) The a14 value of the matrix.






##### Returns


- `Void`



#### a21() 

(getter/setter) The a21 value of the matrix.






##### Returns


- `Void`



#### a22() 

(getter/setter) The a22 value of the matrix.






##### Returns


- `Void`



#### a23() 

(getter/setter) The a23 value of the matrix.






##### Returns


- `Void`



#### a24() 

(getter/setter) The a24 value of the matrix.






##### Returns


- `Void`



#### a31() 

(getter/setter) The a31 value of the matrix.






##### Returns


- `Void`



#### a32() 

(getter/setter) The a32 value of the matrix.






##### Returns


- `Void`



#### a33() 

(getter/setter) The a33 value of the matrix.






##### Returns


- `Void`



#### a34() 

(getter/setter) The a34 value of the matrix.






##### Returns


- `Void`



#### a41() 

(getter/setter) The a41 value of the matrix.






##### Returns


- `Void`



#### a42() 

(getter/setter) The a42 value of the matrix.






##### Returns


- `Void`



#### a43() 

(getter/setter) The a43 value of the matrix.






##### Returns


- `Void`



#### a44() 

(getter/setter) The a44 value of the matrix.






##### Returns


- `Void`



#### array() 

(getter) Returns the basic array representation of this matrix.






##### Returns


- `Void`



#### fromRotationTranslationScale(q, v, s) 

Creates a matrix from a quaternion rotation, vector translation and vector scale
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.translate(dest, vec);
    let quatMat = mat4.create();
    quat4.toMat4(quat, quatMat);
    mat4.multiply(dest, quatMat);
    mat4.scale(dest, scale)




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| q | `quat4`  | Rotation quaternion | &nbsp; |
| v | `vec3`  | Translation vector | &nbsp; |
| s | `vec3`  | Scaling vector | &nbsp; |




##### Returns


- `mat4`  out



#### fromRotationTranslationScaleOrigin(q, v, s, o) 

Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
This is equivalent to (but much faster than):

    mat4.identity(dest);
    mat4.translate(dest, vec);
    mat4.translate(dest, origin);
    let quatMat = mat4.create();
    quat4.toMat4(quat, quatMat);
    mat4.multiply(dest, quatMat);
    mat4.scale(dest, scale)
    mat4.translate(dest, negativeOrigin);




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| q | `quat4`  | Rotation quaternion | &nbsp; |
| v | `vec3`  | Translation vector | &nbsp; |
| s | `vec3`  | Scaling vector | &nbsp; |
| o | `vec3`  | The origin vector around which to scale and rotate | &nbsp; |




##### Returns


- `mat4`  out



#### fromQuat(q) 

Calculates a 4x4 matrix from the given quaternion




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| q | `quat`  | Quaternion to create matrix from | &nbsp; |




##### Returns


- `mat4`  out



#### frustum(left, right, bottom, top, near, far) 

Generates a frustum matrix with the given bounds




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| left | `Number`  | Left bound of the frustum | &nbsp; |
| right | `Number`  | Right bound of the frustum | &nbsp; |
| bottom | `Number`  | Bottom bound of the frustum | &nbsp; |
| top | `Number`  | Top bound of the frustum | &nbsp; |
| near | `Number`  | Near bound of the frustum | &nbsp; |
| far | `Number`  | Far bound of the frustum | &nbsp; |




##### Returns


- `mat4`  out



#### perspective(fovy, aspect, near, far) 

Generates a perspective projection matrix with the given bounds.
Passing null/undefined/no value for far will generate infinite projection matrix.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| fovy | `number`  | Vertical field of view in radians | &nbsp; |
| aspect | `number`  | Aspect ratio. typically viewport width/height | &nbsp; |
| near | `number`  | Near bound of the frustum | &nbsp; |
| far | `number`  | Far bound of the frustum, can be null or Infinity | &nbsp; |




##### Returns


- `mat4`  out



#### ortho(left, right, bottom, top, near, far) 

Generates a orthogonal projection matrix with the given bounds




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| left | `number`  | Left bound of the frustum | &nbsp; |
| right | `number`  | Right bound of the frustum | &nbsp; |
| bottom | `number`  | Bottom bound of the frustum | &nbsp; |
| top | `number`  | Top bound of the frustum | &nbsp; |
| near | `number`  | Near bound of the frustum | &nbsp; |
| far | `number`  | Far bound of the frustum | &nbsp; |




##### Returns


- `mat4`  out



#### lookAt(out, eye, center, up) 

Generates a look-at matrix with the given eye position, focal point, and up axis.
If you want a matrix that actually makes an object look at another object, you should use targetTo instead.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| out | `mat4`  | mat4 frustum matrix will be written into | &nbsp; |
| eye | `vec3`  | Position of the viewer | &nbsp; |
| center | `vec3`  | Point the viewer is looking at | &nbsp; |
| up | `vec3`  | vec3 pointing up | &nbsp; |




##### Returns


- `mat4`  out



#### targetTo(eye, center, up) 

Generates a matrix that makes something look at something else.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| eye | `vec3`  | Position of the viewer | &nbsp; |
| center | `vec3`  | Point the viewer is looking at | &nbsp; |
| up | `vec3`  | vec3 pointing up | &nbsp; |




##### Returns


- `mat4`  out




### src/Quat.js


#### array() 

(getter) Returns the basic array representation of this quaternion.






##### Returns


- `Void`



#### fromAxisAngle(axis, rad) 

Creates a quaternion from a given axis and rotation




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| axis | `Vec3` `Array`  | the axis around which to rotate | &nbsp; |
| rad | `Number`  | the angle in radians | &nbsp; |




##### Returns


- `Quat`  




### src/Vec2.js


#### new Vec2() 

A basic 2D Vector class that provides simple algebraic functionality in the form
of 2D Vectors.

We use Getters/setters for both principle properties (x & y) as well as virtual
properties (rotation, length etc.).






##### Returns


- `Void`



#### Vec2.constructor(x, y) 

The Vector Class constructor




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| x | `number`  | The x coord | &nbsp; |
| y | `number`  | The y coord | &nbsp; |




##### Returns


- `Void`



#### Vec2.reset(x, y) 

Resets the vector coordinates




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| x | `number` `Array`  | The x coord, OR the array to reset to | &nbsp; |
| y | `number`  | The y coord | &nbsp; |




##### Returns


- `Void`



#### Vec2.resetToVector(v) 

Resets the vector coordinates to another vector object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vector`  | The vector object to use to reset the coordinates | &nbsp; |




##### Returns


- `Void`



#### Vec2.clone() 

Clones the vector






##### Returns


- `Vector`  The cloned vector



#### Vec2.add(vector) 

Adds one vector to another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to add to this one | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.addNew(vector) 

Clones the vector and adds the vector to it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to add to this one | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.addScalar(scalar) 

Adds a scalar to the vector, modifying both the x and y




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.addScalarNew(scalar) 

Clones the vector and adds the scalar to it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.subtract(vector) 

Subtracts one vector from another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to subtract from this one | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.subtractNew(vector) 

Clones the vector and subtracts the vector from it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to subtract from this one | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.subtractScalar(scalar) 

Subtracts a scalar from the vector, modifying both the x and y




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to subtract from the vector | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.subtractScalarNew(scalar) 

Clones the vector and subtracts the scalar from it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.divide(vector) 

Divides one vector by another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to divide this by | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.divideNew(vector) 

Clones the vector and divides it by the vector instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to divide the clone by | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.divideScalar(scalar) 

Divides the vector by a scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to divide both x and y by | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.divideScalarNew(scalar) 

Clones the vector and divides it by the provided scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to divide both x and y by | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.multiply(vector) 

Multiplies one vector by another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to multiply this by | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.multiplyNew(vector) 

Clones the vector and multiplies it by the vector instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to multiply the clone by | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.multiplyScalar(scalar) 

Multiplies the vector by a scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to multiply both x and y by | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.multiplyScalarNew(scalar) 

Clones the vector and multiplies it by the provided scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to multiply both x and y by | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.scale() 

Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}






##### Returns


- `Void`



#### Vec2.scaleNew() 

Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}






##### Returns


- `Void`



#### Vec2.rotate(radian) 

Rotates a vecor by a given amount, provided in radians.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| radian | `number`  | The angle, in radians, to rotate the vector by | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.rotateNew(radian) 

Clones the vector and rotates it by the supplied radian value




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| radian | `number`  | The angle, in radians, to rotate the vector by | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.rotateDeg(degrees) 

Rotates a vecor by a given amount, provided in degrees. Converts the degree
value to radians and runs the rotaet method.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| degrees | `number`  | The angle, in degrees, to rotate the vector by | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.rotateDegNew(degrees) 

Clones the vector and rotates it by the supplied degree value




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| degrees | `number`  | The angle, in degrees, to rotate the vector by | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.rotateBy() 

Alias of {@link Vector#rotate__anchor rotate}






##### Returns


- `Void`



#### Vec2.rotateByNew() 

Alias of {@link Vector#rotateNew__anchor rotateNew}






##### Returns


- `Void`



#### Vec2.rotateDegBy() 

Alias of {@link Vector#rotateDeg__anchor rotateDeg}






##### Returns


- `Void`



#### Vec2.rotateDegByNew() 

Alias of {@link Vector#rotateDegNew__anchor rotateDegNew}






##### Returns


- `Void`



#### Vec2.rotateTo(radian) 

Rotates a vector to a specific angle




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| radian | `number`  | The angle, in radians, to rotate the vector to | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.rotateToNew(radian) 

Clones the vector and rotates it to the supplied radian value




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| radian | `number`  | The angle, in radians, to rotate the vector to | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.rotateToDeg(degrees) 

Rotates a vecor to a given amount, provided in degrees. Converts the degree
value to radians and runs the rotateTo method.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| degrees | `number`  | The angle, in degrees, to rotate the vector to | &nbsp; |




##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.rotateToDegNew(degrees) 

Clones the vector and rotates it to the supplied degree value




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| degrees | `number`  | The angle, in degrees, to rotate the vector to | &nbsp; |




##### Returns


- `Vec2`  Returns the clone of itself, modified



#### Vec2.negate() 

Negates the vector.






##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.negateNew() 

Clones the vector and negates it.






##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.inverse() 

Inverses the vector.






##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.inverseNew() 

Clones the vector and then inverses it.






##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.normalise() 

Normalises the vector down to a length of 1 unit






##### Returns


- `Vec2`  Returns itself, modified



#### Vec2.normaliseNew() 

Clones the vector and normalises it






##### Returns


- `Vec2`  Returns a clone of itself, modified



#### Vec2.distance(vector) 

Calculates the distance between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance between this and the supplied vector



#### Vec2.distanceX(vector) 

Calculates the distance on the X axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the x axis, between this and the supplied vector



#### Vec2.distanceY(vector) 

Calculated the distance on the Y axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the y axis, between this and the supplied vector



#### Vec2.dot(vector) 

Calculates the dot product between this and a supplied vectorT




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector object against which to calculate the dot product | &nbsp; |




##### Examples

```javascript
// returns -14
new Vector(2, -3).dot(new Vector(-4, 2))
new Vector(-4, 2).dot(new Vector(2, -3))
new Vector(2, -4).dot(new Vector(-3, 2))
```


##### Returns


- `number`  The dot product of the two vectors



#### Vec2.cross(vector) 

Calculates the cross product between this and the supplied vector.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec2`  | The vector object against which to calculate the cross product | &nbsp; |




##### Examples

```javascript
// returns -2
new Vector(2, -3).cross(new Vector(-4, 2))
new Vector(-4, 2).cross(new Vector(2, -3))
// returns 2
new Vector(2, -4).cross(new Vector(-3, 2))
```


##### Returns


- `number`  The cross product of the two vectors



#### Vec2.x() 

(getter/setter) The x value of the vector.






##### Returns


- `Void`



#### Vec2.y() 

(getter/setter) The y value of the vector.






##### Returns


- `Void`



#### Vec2.lengthSquared() 

(getter/setter) The length of the vector presented as a square. If you're using
length for comparison, this is quicker.






##### Returns


- `Void`



#### Vec2.length() 

(getter/setter) The length of the vector






##### Returns


- `Void`



#### Vec2.angle() 

(getter/setter) The angle of the vector, in radians






##### Returns


- `Void`



#### Vec2.angleInDegrees() 

(getter/setter) The angle of the vector, in radians






##### Returns


- `Void`



#### Vec2.width() 

(getter/setter) Vector width.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec2.height() 

(getter/setter) Vector height.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec2.area() 

(getter) Vector area.






##### Returns


- `Void`



#### Vec2.slope() 

(getter/setter) Vector slope.






##### Returns


- `Void`



#### Vec2.array() 

(getter) Returns the basic array representation of this vector.






##### Returns


- `Void`



#### Vec2.xy() 

(getter/sette) Swizzle XY






##### Returns


- `Void`



#### Vec2.yx() 

(getter/sette) Swizzle YX






##### Returns


- `Void`



#### Vec2.xx() 

(getter/sette) Swizzle XX






##### Returns


- `Void`



#### Vec2.yy() 

(getter/sette) Swizzle YY






##### Returns


- `Void`



#### Vec2.interpolate(v) 

Iterpolates a provided anonymous value into a vew Vec2




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vec2` `array` `string` `number`  | The value to interpolate | &nbsp; |




##### Returns


- `Vec2`  out



#### Vec2.lerp(v1, v2, d) 

Performs a linear interpolation between two vec2's




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v1 | `vec2`  | the first operand | &nbsp; |
| v2 | `vec2`  | the second operand | &nbsp; |
| d | `Number`  | interpolation amount in the range of 0 - 1 | &nbsp; |




##### Returns


- `Vec2`  




### src/Vec3.js


#### new Vec3() 

A basic 3D Vector class that provides simple algebraic functionality in the form
of 3D Vectors.

We use Getters/setters for both principle properties (x & y) as well as virtual
properties (rotation, length etc.).






##### Returns


- `Void`



#### Vec3.constructor(x, y) 

The Vector Class constructor




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| x | `number`  | The x coord | &nbsp; |
| y | `number`  | The y coord | &nbsp; |




##### Returns


- `Void`



#### Vec3.reset(x, y) 

Resets the vector coordinates




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| x | `number` `Array`  | The x coord, OR the array to reset to | &nbsp; |
| y | `number`  | The y coord | &nbsp; |




##### Returns


- `Void`



#### Vec3.resetToVector(v) 

Resets the vector coordinates to another vector object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vector`  | The vector object to use to reset the coordinates | &nbsp; |




##### Returns


- `Void`



#### Vec3.clone() 

Clones the vector






##### Returns


- `Vec3`  The cloned vector



#### Vec3.add(vector) 

Adds one vector to another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to add to this one | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.addNew(vector) 

Clones the vector and adds the vector to it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to add to this one | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.addScalar(scalar) 

Adds a scalar to the vector, modifying both the x and y




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.addScalarNew(scalar) 

Clones the vector and adds the scalar to it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.subtract(vector) 

Subtracts one vector from another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to subtract from this one | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.subtractNew(vector) 

Clones the vector and subtracts the vector from it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to subtract from this one | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.subtractScalar(scalar) 

Subtracts a scalar from the vector, modifying both the x and y




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to subtract from the vector | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.subtractScalarNew(scalar) 

Clones the vector and subtracts the scalar from it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.divide(vector) 

Divides one vector by another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to divide this by | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.divideNew(vector) 

Clones the vector and divides it by the vector instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to divide the clone by | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.divideScalar(scalar) 

Divides the vector by a scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to divide both x and y by | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.divideScalarNew(scalar) 

Clones the vector and divides it by the provided scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to divide both x and y by | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.multiply(vector) 

Multiplies one vector by another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to multiply this by | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.multiplyNew(vector) 

Clones the vector and multiplies it by the vector instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to multiply the clone by | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.multiplyScalar(scalar) 

Multiplies the vector by a scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to multiply both x and y by | &nbsp; |




##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.multiplyScalarNew(scalar) 

Clones the vector and multiplies it by the provided scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to multiply both x and y by | &nbsp; |




##### Returns


- `Vec3`  Returns the clone of itself, modified



#### Vec3.scale() 

Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}






##### Returns


- `Void`



#### Vec3.scaleNew() 

Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}






##### Returns


- `Void`



#### Vec3.negate() 

Negates the vector.






##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.negateNew() 

Clones the vector and negates it.






##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.inverse() 

Inverses the vector.






##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.inverseNew() 

Clones the vector and then inverses it.






##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.normalise() 

Normalises the vector down to a length of 1 unit






##### Returns


- `Vec3`  Returns itself, modified



#### Vec3.normaliseNew() 

Clones the vector and normalises it






##### Returns


- `Vec3`  Returns a clone of itself, modified



#### Vec3.distance(vector) 

Calculates the distance between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance between this and the supplied vector



#### Vec3.distanceX(vector) 

Calculates the distance on the X axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the x axis, between this and the supplied vector



#### Vec3.distanceY(vector) 

Calculated the distance on the Y axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the y axis, between this and the supplied vector



#### Vec3.distanceZ(vector) 

Calculated the distance on the Z axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the y axis, between this and the supplied vector



#### Vec3.dot(vector) 

Calculates the dot product between this and a supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector object against which to calculate the dot product | &nbsp; |




##### Examples

```javascript
// returns -14
new Vector(2, -3).dot(new Vector(-4, 2))
new Vector(-4, 2).dot(new Vector(2, -3))
new Vector(2, -4).dot(new Vector(-3, 2))
```


##### Returns


- `number`  The dot product of the two vectors



#### Vec3.cross(vector) 

Calculates the cross product between this and the supplied vector.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec3`  | The vector object against which to calculate the cross product | &nbsp; |




##### Examples

```javascript
// returns -2
new Vector(2, -3).cross(new Vector(-4, 2))
new Vector(-4, 2).cross(new Vector(2, -3))
// returns 2
new Vector(2, -4).cross(new Vector(-3, 2))
```


##### Returns


- `Vec3`  The cross product of the two vectors



#### Vec3.getAxisAngle(axis) 

Gets the rotation axis and angle for a given




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| axis | `vec3`  | Vector receiving the axis of rotation | &nbsp; |




##### Returns


- `Number`  Angle, in radians, of the rotation



#### Vec3.x() 

(getter/setter) The x value of the vector.






##### Returns


- `Void`



#### Vec3.y() 

(getter/setter) The y value of the vector.






##### Returns


- `Void`



#### Vec3.z() 

(getter/setter) The y value of the vector.






##### Returns


- `Void`



#### Vec3.lengthSquared() 

(getter/setter) The length of the vector presented as a square. If you're using
length for comparison, this is quicker.






##### Returns


- `Void`



#### Vec3.length() 

(getter/setter) The length of the vector






##### Returns


- `Void`



#### Vec3.width() 

(getter/setter) Vector width.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec3.height() 

(getter/setter) Vector height.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec3.depth() 

(getter/setter) Vector height.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec3.area() 

(getter) Vector area.






##### Returns


- `Void`



#### Vec3.array() 

(getter) Returns the basic array representation of this vector.






##### Returns


- `Void`



#### Vec3.xyz() 

(getter/sette) Swizzle XYZ






##### Returns


- `Void`



#### Vec3.yzx() 

(getter/sette) Swizzle YZX






##### Returns


- `Void`



#### Vec3.zxy() 

(getter/sette) Swizzle ZXY






##### Returns


- `Void`



#### Vec3.xy() 

(getter/sette) Swizzle XY






##### Returns


- `Void`



#### Vec3.yz() 

(getter/sette) Swizzle YZ






##### Returns


- `Void`



#### Vec3.zx() 

(getter/sette) Swizzle zx






##### Returns


- `Void`



#### Vec3.yx() 

(getter/sette) Swizzle YX






##### Returns


- `Void`



#### Vec3.zy() 

(getter/sette) Swizzle ZY






##### Returns


- `Void`



#### Vec3.xx() 

(getter/sette) Swizzle XX






##### Returns


- `Void`



#### Vec3.yy() 

(getter/sette) Swizzle YY






##### Returns


- `Void`



#### Vec3.zz() 

(getter/sette) Swizzle ZZ






##### Returns


- `Void`



#### Vec3.interpolate(v) 

Iterpolates a provided anonymous value into a vew Vec3




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vec3` `array` `string` `number`  | The value to interpolate | &nbsp; |




##### Returns


- `Vec3`  out



#### Vec3.lerp(v1, v2, d) 

Performs a linear interpolation between two Vec3's




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v1 | `Vec3`  | the first operand | &nbsp; |
| v2 | `Vec3`  | the second operand | &nbsp; |
| d | `Number`  | interpolation amount in the range of 0 - 1 | &nbsp; |




##### Returns


- `Vec3`  




### src/Vec4.js


#### new Vec4() 

A basic 3D Vector class that provides simple algebraic functionality in the form
of 3D Vectors.

We use Getters/setters for both principle properties (x & y) as well as virtual
properties (rotation, length etc.).






##### Returns


- `Void`



#### Vec4.constructor(x, y) 

The Vector Class constructor




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| x | `number`  | The x coord | &nbsp; |
| y | `number`  | The y coord | &nbsp; |




##### Returns


- `Void`



#### Vec4.reset(x, y) 

Resets the vector coordinates




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| x | `number` `Array`  | The x coord, OR the array to reset to | &nbsp; |
| y | `number`  | The y coord | &nbsp; |




##### Returns


- `Void`



#### Vec4.resetToVector(v) 

Resets the vector coordinates to another vector object




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vector`  | The vector object to use to reset the coordinates | &nbsp; |




##### Returns


- `Void`



#### Vec4.clone() 

Clones the vector






##### Returns


- `Vec4`  The cloned vector



#### Vec4.add(vector) 

Adds one vector to another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to add to this one | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.addNew(vector) 

Clones the vector and adds the vector to it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to add to this one | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.addScalar(scalar) 

Adds a scalar to the vector, modifying both the x and y




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.addScalarNew(scalar) 

Clones the vector and adds the scalar to it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.subtract(vector) 

Subtracts one vector from another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to subtract from this one | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.subtractNew(vector) 

Clones the vector and subtracts the vector from it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to subtract from this one | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.subtractScalar(scalar) 

Subtracts a scalar from the vector, modifying both the x and y




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to subtract from the vector | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.subtractScalarNew(scalar) 

Clones the vector and subtracts the scalar from it instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to add to the vector | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.divide(vector) 

Divides one vector by another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to divide this by | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.divideNew(vector) 

Clones the vector and divides it by the vector instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to divide the clone by | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.divideScalar(scalar) 

Divides the vector by a scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to divide both x and y by | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.divideScalarNew(scalar) 

Clones the vector and divides it by the provided scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to divide both x and y by | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.multiply(vector) 

Multiplies one vector by another.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to multiply this by | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.multiplyNew(vector) 

Clones the vector and multiplies it by the vector instead




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to multiply the clone by | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.multiplyScalar(scalar) 

Multiplies the vector by a scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to multiply both x and y by | &nbsp; |




##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.multiplyScalarNew(scalar) 

Clones the vector and multiplies it by the provided scalar.




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| scalar | `number`  | The scalar to multiply both x and y by | &nbsp; |




##### Returns


- `Vec4`  Returns the clone of itself, modified



#### Vec4.scale() 

Alias of {@link Vector#multiplyScalar__anchor multiplyScalar}






##### Returns


- `Void`



#### Vec4.scaleNew() 

Alias of {@link Vector#multiplyScalarNew__anchor multiplyScalarNew}






##### Returns


- `Void`



#### Vec4.negate() 

Negates the vector.






##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.negateNew() 

Clones the vector and negates it.






##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.inverse() 

Inverses the vector.






##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.inverseNew() 

Clones the vector and then inverses it.






##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.normalise() 

Normalises the vector down to a length of 1 unit






##### Returns


- `Vec4`  Returns itself, modified



#### Vec4.normaliseNew() 

Clones the vector and normalises it






##### Returns


- `Vec4`  Returns a clone of itself, modified



#### Vec4.distance(vector) 

Calculates the distance between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance between this and the supplied vector



#### Vec4.distanceX(vector) 

Calculates the distance on the X axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the x axis, between this and the supplied vector



#### Vec4.distanceY(vector) 

Calculated the distance on the Y axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the y axis, between this and the supplied vector



#### Vec4.distanceZ(vector) 

Calculated the distance on the Z axis between this and the supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector to calculate the distance from | &nbsp; |




##### Returns


- `number`  The distance, along the y axis, between this and the supplied vector



#### Vec4.dot(vector) 

Calculates the dot product between this and a supplied vector




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector object against which to calculate the dot product | &nbsp; |




##### Examples

```javascript
// returns -14
new Vector(2, -3).dot(new Vector(-4, 2))
new Vector(-4, 2).dot(new Vector(2, -3))
new Vector(2, -4).dot(new Vector(-3, 2))
```


##### Returns


- `number`  The dot product of the two vectors



#### Vec4.cross(vector) 

Calculates the cross product between this and two other supplied vectors




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| vector | `Vec4`  | The vector object against which to calculate the cross product | &nbsp; |




##### Examples

```javascript
// returns -2
new Vector(2, -3).cross(new Vector(-4, 2))
new Vector(-4, 2).cross(new Vector(2, -3))
// returns 2
new Vector(2, -4).cross(new Vector(-3, 2))
```


##### Returns


- `Vec4`  The cross product of the two vectors



#### Vec4.x() 

(getter/setter) The x value of the vector.






##### Returns


- `Void`



#### Vec4.y() 

(getter/setter) The y value of the vector.






##### Returns


- `Void`



#### Vec4.z() 

(getter/setter) The y value of the vector.






##### Returns


- `Void`



#### Vec4.w() 

(getter/setter) The y value of the vector.






##### Returns


- `Void`



#### Vec4.lengthSquared() 

(getter/setter) The length of the vector presented as a square. If you're using
length for comparison, this is quicker.






##### Returns


- `Void`



#### Vec4.length() 

(getter/setter) The length of the vector






##### Returns


- `Void`



#### Vec4.width() 

(getter/setter) Vector width.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec4.height() 

(getter/setter) Vector height.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec4.depth() 

(getter/setter) Vector height.
Alias of {@link Vector#x x}






##### Returns


- `Void`



#### Vec4.area() 

(getter) Vector area.






##### Returns


- `Void`



#### Vec4.array() 

(getter) Returns the basic array representation of this vector.






##### Returns


- `Void`



#### Vec4.xyzw() 

(getter/sette) Swizzle XYZW






##### Returns


- `Void`



#### Vec4.yzwx() 

(getter/sette) Swizzle XYZW






##### Returns


- `Void`



#### Vec4.zwxy() 

(getter/sette) Swizzle XYZW






##### Returns


- `Void`



#### Vec4.wxyz() 

(getter/sette) Swizzle XYZW






##### Returns


- `Void`



#### Vec4.xyz() 

(getter/sette) Swizzle YZX






##### Returns


- `Void`



#### Vec4.yzx() 

(getter/sette) Swizzle YZX






##### Returns


- `Void`



#### Vec4.zxy() 

(getter/sette) Swizzle ZXY






##### Returns


- `Void`



#### Vec4.xx() 

(getter/sette) Swizzle XX






##### Returns


- `Void`



#### Vec4.xy() 

(getter/sette) Swizzle XY






##### Returns


- `Void`



#### Vec4.xz() 

(getter/sette) Swizzle XY






##### Returns


- `Void`



#### Vec4.xw() 

(getter/sette) Swizzle XY






##### Returns


- `Void`



#### Vec4.yx() 

(getter/sette) Swizzle YX






##### Returns


- `Void`



#### Vec4.yy() 

(getter/sette) Swizzle YY






##### Returns


- `Void`



#### Vec4.yz() 

(getter/sette) Swizzle YZ






##### Returns


- `Void`



#### Vec4.yw() 

(getter/sette) Swizzle YZ






##### Returns


- `Void`



#### Vec4.zx() 

(getter/sette) Swizzle zx






##### Returns


- `Void`



#### Vec4.zy() 

(getter/sette) Swizzle ZY






##### Returns


- `Void`



#### Vec4.zz() 

(getter/sette) Swizzle ZZ






##### Returns


- `Void`



#### Vec4.zw() 

(getter/sette) Swizzle XY






##### Returns


- `Void`



#### Vec4.wx() 

(getter/sette) Swizzle wx






##### Returns


- `Void`



#### Vec4.wy() 

(getter/sette) Swizzle WY






##### Returns


- `Void`



#### Vec4.wz() 

(getter/sette) Swizzle WZ






##### Returns


- `Void`



#### Vec4.ww() 

(getter/sette) Swizzle WW






##### Returns


- `Void`



#### Vec4.interpolate(v) 

Iterpolates a provided anonymous value into a vew Vec4




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v | `Vec4` `array` `string` `number`  | The value to interpolate | &nbsp; |




##### Returns


- `Vec4`  out



#### Vec4.lerp(v1, v2, d) 

Performs a linear interpolation between two Vec4's




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| v1 | `Vec4`  | the first operand | &nbsp; |
| v2 | `Vec4`  | the second operand | &nbsp; |
| d | `Number`  | interpolation amount in the range of 0 - 1 | &nbsp; |




##### Returns


- `Vec4`  




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
