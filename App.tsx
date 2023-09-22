import { useEffect, useState } from "react";
import data from "./Wine-Data.json";
import {
  calculateGamma,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateGammaApprox,
} from "./utils/utils";
import TableRow from "./components/TableRow";
import TableHeader from "./components/TableHeader";

function App() {
  const [wineData, setWineData] = useState<WineData[]>([]);
  const [classMapping, setClassMapping] = useState<Record<number, string>>({});

  useEffect(() => {
    // Load data and calculate class mapping when the component mounts
    setWineData(data);

    // Calculate class mapping
    const mapping: Record<number, string> = {};
    data.forEach((wineData) => {
      const alcoholValue = wineData.Alcohol;
      if (!mapping[alcoholValue]) {
        mapping[alcoholValue] = `Class ${alcoholValue}`;
      }
    });
    setClassMapping(mapping);

    // Calculate "Gamma" for each data point
    calculateGamma(data);
    // Calculate "Gamma" for each data point and rounding it to upto 3 decimal so as to calculate mode
    calculateGammaApprox(data);
  }, []);
  const meanFlavanoids = calculateMean(wineData, "Flavanoids");
  const meanGamma = calculateMean(wineData, "Gamma");
  const medianFlavanoids = calculateMedian(wineData, "Flavanoids");
  const medianGamma = calculateMedian(wineData, "Gamma");
  const modeFlavanoids = calculateMode(wineData, "Flavanoids");
  const modeGamma = calculateMode(wineData, "GammaApprox");

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <TableHeader title="Measure" data={classMapping} />
        <TableRow title="Flavanoids Mean" data={meanFlavanoids} />
        <TableRow title="Flavanoids Median" data={medianFlavanoids} />
        <TableRow title="Flavanoids Mode" data={modeFlavanoids} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          marginTop: 50,
        }}
      >
        <TableHeader title="Measure" data={classMapping} />
        <TableRow title="Gamma Mean" data={meanGamma} />
        <TableRow title="Gamma Median" data={medianGamma} />
        <TableRow title="Gamma Mode" data={modeGamma} />
      </div>
    </>
  );
}

export default App;
