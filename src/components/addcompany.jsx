import { useReducer } from "react";
import { data, NavLink, useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "../firebase/config";

function Addcompany() {
  //initialize default input value
  const initialState = {
    Id: "",
    Name: "",
    Value: "",
    Precentage: "",
    Priority: "",
  };
  //function for save data after every change
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET":
        return {
          ...state,
          [action.field]: action.value,
        };

      case "RESET":
        return initialState;

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  //funciton to count precentage
  const checkPrecentage = async () => {
    const snapshot = await getDocs(collection(db, "primary"));
    const database = snapshot.docs.map((doc) => ({
      id: doc.id,
      precentage: doc.data().precentage,
      priority: doc.data().priority,
    }));
    let allPrecentage = 0;
    let priorityPrecentage = 0;
    database.forEach((element) => {
      if (
        element.priority === "" ||
        element.priority === null ||
        element.priority === undefined
      ) {
        allPrecentage += element.precentage;
      } else {
        switch (Number(element.priority)) {
          case 1:
            priorityPrecentage += 0.2;
            break;
          case 2:
            priorityPrecentage += 0.4;
            break;
          case 3:
            priorityPrecentage += 0.6;
            break;
          case 4:
            priorityPrecentage += 0.8;
            break;
          case 5:
            priorityPrecentage += 1.0;
            break;
          case 6:
            priorityPrecentage += 1.2;
            break;
          case 7:
            priorityPrecentage += 1.4;
            break;
          case 8:
            priorityPrecentage += 1.6;
            break;
          case 9:
            priorityPrecentage += 1.8;
            break;
          case 10:
            priorityPrecentage += 2.0;
            break;
          default:
            break;
        }
      }
    });
    let priorityCount = (100 - allPrecentage) / priorityPrecentage;
    const updatedData = snapshot.docs.map((doc) => {
      const data = doc.data();
      const priority = Number(data.priority);
      let adjustedPrecentage = data.precentage;

      switch (priority) {
        case 1:
          adjustedPrecentage = 0.2 * priorityCount;
          break;
        case 2:
          adjustedPrecentage = 0.4 * priorityCount;
          break;
        case 3:
          adjustedPrecentage = 0.6 * priorityCount;
          break;
        case 4:
          adjustedPrecentage = 0.8 * priorityCount;
          break;
        case 5:
          adjustedPrecentage = 1.0 * priorityCount;
          break;
        case 6:
          adjustedPrecentage = 1.2 * priorityCount;
          break;
        case 7:
          adjustedPrecentage = 1.4 * priorityCount;
          break;
        case 8:
          adjustedPrecentage = 1.6 * priorityCount;
          break;
        case 9:
          adjustedPrecentage = 1.8 * priorityCount;
          break;
        case 10:
          adjustedPrecentage = 2.0 * priorityCount;
          break;
        default:
          break;
      }

      return {
        id: doc.id,
        ...data,
        precentage: adjustedPrecentage,
      };
    });

    updatedData.forEach(async (element) => {
      const docRef = doc(db, "primary", element.id);
      await updateDoc(docRef, {
        precentage: Number(element.precentage),
      });
    });
    /* 
1=0.2
2=0.4
3=0.6
4=0.8
5=1
6=1.2
7=1.4
8=1.6
9=1.8
10=2
*/
  };

  //save data to database and erase saved values from form
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "primary", state.Id), {
        name: state.Name,
        value: Number(state.Value),
        precentage: Number(state.Precentage),
        priority: Number(state.Priority),
      });

      dispatch({ type: "RESET" });
      checkPrecentage();
      navigate("/");
    } catch (err) {
      console.error("nepovedlo se to ulozit", err);
    }
  };
  //defined input form and remaining visual content
  return (
    <div>
      <form onSubmit={submitForm}>
        <input
          type="text"
          onChange={(e) =>
            dispatch({
              type: "SET",
              field: e.target.name,
              value: e.target.value,
            })
          }
          placeholder="Id"
          name="Id"
          value={state.Id}
        />
        <input
          type="text"
          onChange={(e) =>
            dispatch({
              type: "SET",
              field: e.target.name,
              value: e.target.value,
            })
          }
          placeholder="name"
          name="Name"
          value={state.Name}
        />
        <input
          type="number"
          onChange={(e) =>
            dispatch({
              type: "SET",
              field: e.target.name,
              value: e.target.value,
            })
          }
          placeholder="value"
          name="Value"
          min={0}
          value={state.Value}
        />
        <input
          type="number"
          onChange={(e) =>
            dispatch({
              type: "SET",
              field: e.target.name,
              value: e.target.value,
            })
          }
          placeholder="precentage"
          name="Precentage"
          min={0}
          max={100}
          value={state.Precentage}
        />
        <input
          type="number"
          onChange={(e) =>
            dispatch({
              type: "SET",
              field: e.target.name,
              value: e.target.value,
            })
          }
          placeholder="priority"
          name="Priority"
          min={1}
          max={10}
          value={state.Priority}
        />
        <input type="submit" value="ulozit" />
      </form>

      <NavLink to="/">
        <button onClick={() => dispatch({ type: "RESET" })}>Zpet</button>
      </NavLink>
    </div>
  );
}

export default Addcompany;
