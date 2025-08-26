import { db } from "../firebase/config";
import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import OverallValues from "./overallValues";
import { NavLink } from "react-router-dom";
import CoutAdding from "./countAdding";
import "./company.css";

function company() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [deposit, setDeposit] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  //function for load data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "primary"));
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          expectedValue: 0,
          deficit: 0,
          add: 0,
        }));
        setData(result);
        console.log("po fetch", result);
        setDeposit(0);
      } catch (err) {
        console.error("Chyba při načítání dat:", err);
        setError(err);
      }
    };

    fetchData();
  }, [refreshTrigger]);
  //function for erase company
  const deleteCompany = async (id) => {
    try {
      await deleteDoc(doc(db, "primary", id));
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Chyba při mazání:", err);
      setError(err);
    }
  };
  console.log("pred zobrazenim", data);
  return (
    <div className="allCompany">
      <CoutAdding data={data} updateData={setData} deposit={deposit} />
      <OverallValues
        data={data}
        updateData={setData}
        setOnlyDeposit={setDeposit}
        fetchData={() => setRefreshTrigger((prev) => prev + 1)}
      />
      <h1>Data z Firestore:</h1>
      {error && <h2>Chyba: {error.message}</h2>}

      {data.map((item) => (
        <div key={item.id} className="oneCompany">
          <p>Id: {item.id}</p>
          <p>Name: {item.name}</p>
          <p>Value: {item.value}</p>
          <p>Precentage: {item.precentage}</p>
          <p>Expected: {item.expectedValue}</p>
          <p>Deficit: {item.deficit}</p>
          {item.add !== 0 && <p>add: {item.add}</p>}
          <button onClick={() => deleteCompany(item.id)}>Smazat</button>
        </div>
      ))}

      <NavLink to="/addCompany">
        <button>Pridat novou</button>
      </NavLink>
    </div>
  );
}

export default company;
