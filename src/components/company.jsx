import { db } from "../firebase/config";
import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
    console.log(data);
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
    setRefreshTrigger((prev) => prev + 1);
  };

  //function to set value to start(set expected value = 0)
  const startCompany = async (id, value) => {
    try {
      await updateDoc(doc(db, "primary", id), {
        startValue: Number(value),
      });
    } catch (err) {
      console.error("nepovedlo se upravit hodnotu na start", err);
    }
    setRefreshTrigger((prev) => prev + 1);
  };
  console.log("pred zobrazenim", data);
  return (
    <div className="allCompany">
      <div className="uci-top"></div>
      <div className="uci-bottom"></div>
      <CoutAdding data={data} updateData={setData} deposit={deposit} />
      <OverallValues
        data={data}
        updateData={setData}
        setOnlyDeposit={setDeposit}
        fetchData={() => setRefreshTrigger((prev) => prev + 1)}
      />
      <h1>Portfolio:</h1>
      {error && <h2>Chyba: {error.message}</h2>}

      <div className="companyList">
        <div className="header">
          <p>Id</p>
          <p>Name</p>
          <p>Value</p>
          <p>Precentage</p>
          <p>Expected</p>
          <p>Deficit</p>
          <p>Add</p>
          <p>Actions</p>
        </div>

        {data.map((item) => (
          <div key={item.id} className="oneCompany">
            <p>{item.id}</p>
            <p>{item.name}</p>
            <p>{Number(item.value).toFixed(2)}</p>
            <p>{Number(item.precentage).toFixed(2)}</p>
            <p>{Number(item.expectedValue).toFixed(2)}</p>
            <p>{Number(item.deficit).toFixed(2)}</p>
            <p>{item.add !== 0 ? item.add : "-"}</p>
            <div className="actions">
              <button onClick={() => deleteCompany(item.id)}>Smazat</button>
              <button onClick={() => startCompany(item.id, item.expectedValue)}>
                Nastavit start
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="konec">
        <NavLink to="/addCompany">
          <button>Pridat novou</button>
        </NavLink>
      </div>
    </div>
  );
}

export default company;
