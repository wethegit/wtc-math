interface V4Q {
  x:number
  y:number
  z:number
  w:number
  length:number
  lengthSquared: number
  width:number
  height:number
  depth:number
  area:number
  array:number[]
  xyzw:any
  yzwx:any
  zwxy:any
  wxyz:any
  xyz:any
  yzx:any
  zxy:any
  xx:any
  xy:any
  xz:any
  xw:any
  yx:any
  yy:any
  yz:any
  yw:any
  zx:any
  zy:any
  zz:any
  zw:any
  wx:any
  wy:any
  wz:any
  ww:any
  reset(...args:number[]):V4Q
  resetToVector(v:V4Q):V4Q
  clone():V4Q
  rotateX(origin:V4Q, rad:number):V4Q
  rotateXNew(origin:V4Q, rad:number):V4Q
  rotateY(origin:V4Q, rad:number):V4Q
  rotateYNew(origin:V4Q, rad:number):V4Q
  rotateZ(origin:V4Q, rad:number):V4Q
  rotateZNew(origin:V4Q, rad:number):V4Q
  add(vector:V4Q):V4Q
  addNew(vector:V4Q):V4Q
  addScalar(scalar:number):V4Q
  addScalarNew(scalar:number):V4Q
  subtract(vector:V4Q):V4Q
  subtractNew(vector:V4Q):V4Q
  subtractScalar(scalar:number):V4Q
  subtractScalarNew(scalar:number):V4Q
  divide(vector:V4Q):V4Q
  divideNew(vector:V4Q):V4Q
  divideScalar(scalar:number):V4Q
  divideScalarNew(scalar:number):V4Q
  multiply(q:V4Q):V4Q
  multiplyNew(q:V4Q):V4Q
  multiplyScalar(scalar:number):V4Q
  multiplyScalarNew(scalar:number):V4Q
  scale(scalar:number):V4Q
  scaleNew(scalar:number):V4Q
  transformByMat4(m:any):V4Q
  transformByMat4New(m:any):V4Q
  transformByQuat(q:any):V4Q
  transformByQuatNew(q:any):V4Q
  negate():V4Q
  negateNew():V4Q
  inverse():V4Q
  inverseNew():V4Q
	normalise():V4Q
	normaliseNew():V4Q
	distance(vector:V4Q):number
	distanceX(vector:V4Q):number
	distanceY(vector:V4Q):number
	distanceZ(vector:V4Q):number
	distanceW(vector:V4Q):number
	dot(vector:V4Q):number
	cross(v:V4Q, w:V4Q):V4Q
  crossNew(v:V4Q, w:V4Q):V4Q
  ceil():V4Q
  ceilNew():V4Q
  floor():V4Q
  floorNew():V4Q
  round():V4Q
  roundNew():V4Q
  fract():V4Q
  fractNew():V4Q
}
export default V4Q;

