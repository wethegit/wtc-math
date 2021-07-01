const conversionFactor = 180 / Math.PI;

const radianToDegrees = function(radian:number):number {
	return radian * conversionFactor;
}

const degreesToRadian = function(degrees:number):number {
	return degrees / conversionFactor;
}

export { radianToDegrees, degreesToRadian };