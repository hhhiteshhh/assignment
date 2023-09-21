import React from "react";
import data from "./Wine-Data.json";

// Define a type for your data
interface WineData {
  Alcohol: number;
  "Malic Acid": number;
  Ash: number | string;
  "Alcalinity of ash": number;
  Magnesium: number;
  "Total phenols": number;
  Flavanoids: number | string;
  "Nonflavanoid phenols": number | string;
  Proanthocyanins: string;
  "Color intensity": number | string;
  Hue: number;
  "OD280/OD315 of diluted wines": string | number;
  Unknown: number;
  Gamma?: number;
}
type WineProperty = keyof WineData;

function App() {
  const wineData: WineData[] = data;
  function calculateGamma(data: WineData[]) {
    for (const entry of data) {
      const ash = parseFloat(entry.Ash as string);
      const magnesium = entry.Magnesium;
      const hue = entry.Hue;
      if (!isNaN(ash) && !isNaN(magnesium) && !isNaN(hue)) {
        entry.Gamma = (ash * hue) / magnesium;
      } else {
        entry.Gamma = undefined; // Set to undefined if any of the required properties are missing or not a number
      }
    }
  }

  // Calculate "Gamma" for each data point
  calculateGamma(wineData);

  function calculateMeanByClass<T extends WineProperty>(
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
      const mean =
        valueArray.reduce((sum, v) => sum + v, 0) / valueArray.length;
      classMeans[alcoholClass] = mean;
    });

    return classMeans;
  }
  function calculateMedianByClass<T extends WineProperty>(
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
      classMedians[alcoholClass] = median;
    });

    return classMedians;
  }

  function calculateModeByClass<T extends WineProperty>(
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

      classModes[alcoholClass] = mode;
    });

    return classModes;
  }

  const meanFlavanoidsByClass = calculateMeanByClass(wineData, "Flavanoids");
  const meanGammaByClass = calculateMeanByClass(wineData, "Gamma");
  const medianFlavanoidsByClass = calculateMedianByClass(
    wineData,
    "Flavanoids"
  );
  const medianGammaByClass = calculateMedianByClass(wineData, "Gamma");
  const modeFlavanoidsByClass = calculateModeByClass(wineData, "Flavanoids");
  const modeGammaByClass = calculateModeByClass(wineData, "Gamma");

  console.log("Class-wise Mean Flavanoids:", meanFlavanoidsByClass);
  console.log("Class-wise Mean Gamma:", meanGammaByClass);
  console.log("Class-wise Median Flavanoids:", medianFlavanoidsByClass);
  console.log("Class-wise Median Gamma:", medianGammaByClass);
  console.log("Class-wise Mode Flavanoids:", modeFlavanoidsByClass);
  console.log("Class-wise Mode Gamma:", modeGammaByClass);

  return <div>app</div>;
}

export default App;
