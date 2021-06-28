# [wtc-math](https://github.com/wethegit/wtc-math#readme) *0.1.7*

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




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
