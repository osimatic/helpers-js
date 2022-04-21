
Array.prototype.unset = function(index) {
	if (index > -1) {
		this.splice(index,1);
	}
};

Array.prototype.unsetVal = function(val) {
	let index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

Array.prototype.inArray = function(p_val) {
	return this.indexOf(p_val) > -1;
};

Array.prototype.unique = function() {
	return [...new Set(this)];
};

Array.prototype.removeEmptyValues = function() {
	return this.filter(val => val != '');
};

Array.prototype.hasOwnIndex = function(prop) {
	return this.hasOwnProperty(prop) && /^0$|^[1-9]\d*$/.test(prop) && prop <= 4294967294; // 2^32 - 2
};

Array.prototype.cumulativeSum = function() {
	let cumulativeSum = (sum => value => sum += value)(0);
	return this.map(cumulativeSum);
};

Array.prototype.intersect = function(array1, array2) {
	return array1.filter(value => array2.includes(value));
}

Array.prototype.filterUnique = function() {
	//let onlyUnique = (([value, index, self]) => self.indexOf(value) === index);
	return this.filter((v, i, a) => a.indexOf(v) === i);
};

function getValuesByKeyInArrayOfArrays(array, key) {
	let listeValues = [];
	for (let i in array) {
		let subArray = array[i];
		if (typeof(subArray[key]) != 'undefined') {
			listeValues.push(subArray[key]);
		}
	}
	return listeValues;
}

Object.toArray = (obj) => {
	return Object.keys(obj).map(key => obj[key]);
};

Object.filter = (obj, predicate) => {
	return Object.keys(obj)
		.filter( key => predicate(obj[key]) )
		.reduce( (res, key) => (res[key] = obj[key], res), {} );
};

function renameKeys(obj, keysMap) {
	return Object.keys(obj).reduce(
		(acc, key) => ({
			...acc,
			...{ [keysMap[key] || key]: obj[key] }
		}),
		{}
	);
}

function renameKeysByCallback(obj, callback) {
	return Object.keys(obj).reduce(
		(acc, key) => ({
			...acc,
			...{[callback(key)]: obj[key]}
		}),
		{}
	);
}

module.exports = { getValuesByKeyInArrayOfArrays, renameKeys, renameKeysByCallback };