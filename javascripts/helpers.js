/* 
 * Return the index of the smallest element in the array
 * that is greater than or equal to val.
 * TODO: Be smarter if all elements are less than val.
 */
Array.prototype.indexOfLeastGreaterThan = function(val) {
	var minIndex = 0;	
	var minDist = Number.MAX_VALUE;
	for (var i = 0; i < this.length; i++) {
		if ((this[i] >= val) && (Math.abs(this[i] - val) < minDist)) {
			minDist = Math.abs(this[i] - val);
			minIndex = i;
		}
	}
	return minIndex;
}

Array.prototype.indexOfGreatestLessThan = function(val) {
	var minIndex = 0;	
	var minDist = Number.MAX_VALUE;
	for (var i = 0; i < this.length; i++) {
		if ((this[i] <= val) && (Math.abs(this[i] - val) < minDist)) {
			minDist = Math.abs(this[i] - val);
			minIndex = i;
		}
	}
	return minIndex;
}
