const permutationLength = (nestedArray) => {
  const n = nestedArray.length
	let total = 1; 
	for (i=1; i<=n; i++) {
		total = total * i; 
	}
	return total; 
}

const cartasianProductLength = (nestedArray) => {
  return nestedArray
    .map(array => array.length)
    .reduce((computed, current) => computed * current, 1)
}
module.exports = {
    permutationLength,
    cartasianProductLength
}