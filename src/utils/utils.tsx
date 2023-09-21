export function calculateMeanByClass<T extends WineProperty>(
  data: WineData[],
  property: T
): Record<number, number> {
  const classMeanMap = new Map<number, number[]>();

  // Calculate the mean of the specified property for each class
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
    classMeans[alcoholClass] = mean;
  });

  return classMeans;
}
