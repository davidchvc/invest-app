import { useEffect } from "react";

function countAdding({ data, updateData, deposit }) {
  console.log("dfahahadfhdsfh", deposit);
  const deficitList = data.map((item) => item.deficit);
  useEffect(() => {
    //if condotion to make sure that this doesn work if it is not necesary
    if (
      !Array.isArray(data) ||
      data.length == 0 ||
      !data.some((item) => item.expectedValue !== 0)
    ) {
      return;
    }

    let add = [];
    let summaryOfDeficit = 0;
    let numberLessThanCondition = 0;
    let minimalNumberToAdd = 0;
    //load data to local table
    data.forEach((item) => {
      if (item.deficit <= 0) {
        add.push({ id: item.id, value: item.deficit });
      }
    });

    //console.log(add);
    //while cyklus to find number less than 10
    do {
      //reset conditions for new cycle
      numberLessThanCondition = 0;
      minimalNumberToAdd = 0;
      summaryOfDeficit = 0;
      //summary of deficit
      add.forEach((item) => {
        const value = Number(item.value);
        if (value <= 0) {
          summaryOfDeficit += value;
        }
      });

      //count real deposit for company, if less than 10 count + 1 and search for minimal deposit if there is something less than 10
      add = add.map((item) => {
        const realDeposit = (deposit / summaryOfDeficit) * item.value;
        if (realDeposit < 10) {
          numberLessThanCondition = numberLessThanCondition + 1;
          if (minimalNumberToAdd == 0 || minimalNumberToAdd > realDeposit) {
            minimalNumberToAdd = realDeposit;
          }
        }
        return { ...item, realDeposit };
      });
      //erase of minimal deposit less than 10

      add = add.filter((item) => item.realDeposit !== minimalNumberToAdd);
    } while (numberLessThanCondition);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let roundedSum = 0;

    // round every data expect of last where is sumed round unprecision
    add = add.map((item, index) => {
      if (index === add.length - 1) {
        const correctedValue = Number((deposit - roundedSum).toFixed(2));
        return {
          ...item,
          realDeposit: correctedValue,
        };
      } else {
        const rounded = Number(item.realDeposit.toFixed(2));
        roundedSum += rounded;
        return {
          ...item,
          realDeposit: rounded,
        };
      }
    });

    const updatedData = data.map((item) => {
      const match = add.find((a) => a.id === item.id);

      if (match) {
        return {
          ...item,

          add: match.realDeposit, // název a hodnota z `add`
        };
      }
      return item; // záznamy, které nejsou v `add`, zůstávají nezměněnéa
    });

    updateData(updatedData);
    add = [];
  }, [deficitList.join(","), deposit]);

  //dodat kolik jsem zadal vklad potom upravit pole kolik mam realne vlozit a nasledovne pole projit a zjistit jestli nemam pridat mene nez 10
  //return <h2>Vklad{deposit}</h2>;
}

export default countAdding;
