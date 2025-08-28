import { db } from "../firebase/config";
import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import "./overallValues.css";

function overallValues({ data, updateData, setOnlyDeposit, fetchData }) {
  console.log("overallValues");
  //sum portofolio value
  const portfolioValue = data.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );
  //sum precentage of companies
  const precentageSum = data.reduce(
    (sum, item) => sum + Number(item.precentage || 0),
    0
  );

  const [valueWithDeposit, setDeposit] = useState(portfolioValue);
  const [writedNumber, setNumber] = useState("");

  const sendDeposit = async (e) => {
    e.preventDefault();
    const updateDeposit = data.filter((item) => item.hasOwnProperty("add"));

    for (const company of updateDeposit)
      try {
        await updateDoc(doc(db, "primary", company.id), {
          name: company.name,
          value: Number(company.value + company.add).toFixed(2),
          precentage: Number(company.precentage),
        });

        setNumber("");
      } catch (err) {
        console.error("nepovedlo se to ulozit", err);
      }
    fetchData();
  };
  //if walue is added than change all numbers
  useEffect(() => {
    if (portfolioValue > valueWithDeposit) {
      setDeposit(portfolioValue);
    }

    // count expected value withouth round
    const rawData = data.map((item) => ({
      ...item,
      expectedValueRaw: valueWithDeposit * (item.precentage / 100),
    }));

    let roundedSum = 0;

    // round every data expect of last where is sumed round unprecision
    const newData = rawData.map((item, index) => {
      if (index === rawData.length - 1) {
        let correctedValue = Math.abs(
          Number((valueWithDeposit - roundedSum).toFixed(2))
        );
        if (item.startValue !== null) {
          correctedValue = correctedValue - item.startValue;
        }
        return {
          ...item,
          expectedValue: correctedValue,
          deficit: (item.value - correctedValue).toFixed(2),
        };
      } else {
        let rounded = Number(item.expectedValueRaw.toFixed(2));
        roundedSum += rounded;
        if (item.startValue !== null) {
          rounded = rounded - item.startValue;
        }
        return {
          ...item,
          expectedValue: rounded,
          deficit: (item.value - rounded).toFixed(2),
        };
      }
    });

    updateData(newData);
  }, [valueWithDeposit, portfolioValue]);

  return (
    <div className="infotabulka">
      <p>Celkova hodnota: {portfolioValue}</p>
      <p>Hodnota s vkladem: {valueWithDeposit}</p>
      <p>Procenta celkem: {precentageSum}</p>
      <form onSubmit={sendDeposit}>
        <input
          className="bar"
          min={0}
          value={writedNumber}
          type="number"
          placeholder="Zadej vklad"
          onChange={(e) => {
            setDeposit(() => {
              return portfolioValue + Number(e.target.value);
            });
            setOnlyDeposit(e.target.value);
            setNumber(e.target.value);
          }}
        />
        <input className="button" type="submit" value="Zapocti do portfolia" />
      </form>
    </div>
  );
}

export default overallValues;
