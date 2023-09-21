export function calculateGamma(data: WineData[]) {
  for (const entry of data) {
    const ash = parseFloat(entry.Ash as string);
    const magnesium = entry.Magnesium;
    const hue = entry.Hue;
    if (!isNaN(ash) && !isNaN(magnesium) && !isNaN(hue)) {
      entry.Gamma = parseFloat(((ash * hue) / magnesium).toFixed(3));
    } else {
      entry.Gamma = undefined; // Set to undefined if any of the required properties are missing or not a number
    }
  }
}

// Function to calculate the mean
export function calculateMean<T extends WineProperty>(
  data: WineData[],
  property: T
): Record<number, number> {
  const classMeanMap = new Map<number, number[]>();

  // pushing the value of property of the datasets according to class
  data.forEach((entry) => {
    const alcoholClass = entry.Alcohol;
    const value = entry[property];

    if (value !== undefined && !isNaN(Number(value))) {
      if (classMeanMap.has(alcoholClass)) {
        classMeanMap.get(alcoholClass)?.push(Number(value));
      } else {
        classMeanMap.set(alcoholClass, [Number(value)]);
      }
    }
  });
  // Calculate the mean for each class
  const classMeans: Record<number, number> = {};
  classMeanMap.forEach((valueArray, alcoholClass) => {
    const mean = valueArray.reduce((sum, v) => sum + v, 0) / valueArray.length;
    classMeans[alcoholClass] = parseFloat(mean.toFixed(3)); // Round to 3 decimal places
  });

  return classMeans;
}
// Function to calculate the median
export function calculateMedian<T extends WineProperty>(
  data: WineData[],
  property: T
): Record<number, number> {
  const classMedianMap = new Map<number, number[]>();

  // Collect values of the specified property for each class
  data.forEach((entry) => {
    const alcoholClass = entry.Alcohol;
    const value = entry[property];

    if (value !== undefined && !isNaN(Number(value))) {
      if (classMedianMap.has(alcoholClass)) {
        classMedianMap.get(alcoholClass)?.push(Number(value));
      } else {
        classMedianMap.set(alcoholClass, [Number(value)]);
      }
    }
  });

  // Calculate the median for each class
  const classMedians: Record<number, number> = {};
  classMedianMap.forEach((valueArray, alcoholClass) => {
    valueArray.sort((a, b) => a - b);
    const middle = Math.floor(valueArray.length / 2);
    const median =
      valueArray.length % 2 === 0
        ? (valueArray[middle - 1] + valueArray[middle]) / 2
        : valueArray[middle];
    classMedians[alcoholClass] = parseFloat(median.toFixed(3)); // Round to 3 decimal places
  });

  return classMedians;
}
// Function to calculate the mode
export function calculateMode<T extends WineProperty>(
  data: WineData[],
  property: T
): Record<number, number | undefined> {
  const classModeMap = new Map<number, Map<number, number>>();

  // Count occurrences of values of the specified property for each class
  data.forEach((entry) => {
    const alcoholClass = entry.Alcohol;
    const value = entry[property];

    if (value !== undefined && !isNaN(Number(value))) {
      if (classModeMap.has(alcoholClass)) {
        const classMap = classModeMap.get(alcoholClass)!;
        if (classMap.has(Number(value))) {
          classMap.set(Number(value), classMap.get(Number(value))! + 1);
        } else {
          classMap.set(Number(value), 1);
        }
      } else {
        const classMap = new Map<number, number>();
        classMap.set(Number(value), 1);
        classModeMap.set(alcoholClass, classMap);
      }
    }
  });

  // Find the mode for each class
  const classModes: Record<number, number | undefined> = {};
  classModeMap.forEach((classMap, alcoholClass) => {
    let maxCount = 0;
    let mode: number | undefined = undefined;

    classMap.forEach((count, value) => {
      if (count > maxCount) {
        maxCount = count;
        mode = value;
      }
    });

    classModes[alcoholClass] = mode; // Round to 3 decimal places
  });

  return classModes;
}
