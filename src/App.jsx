import { useReducer } from "react";
import DigitButtton from "./DigitButton.jsx";
import OperationButton from "./OperationButton.jsx";
import "./style.css";

export const ACTIONS = {
  ADD_DIGITS: "add-digits",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { types, payload }) {
  switch (types) {
    //Action to add or join the numbers we select.
    case ACTIONS.ADD_DIGITS:
      //After evaluation when we start to write a new digit then it will overwrite the previous one.
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      //Prevents adding more zeros intially.
      if (payload.digit === "0" && state.currentOperand === "0") return state;

      //If decimal at first.
      if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: ".",
        };
      }

      //Prevents adding "." (decimals) if there is already a decimal.
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };


    //Action of the operators.
    case ACTIONS.CHOOSE_OPERATION:
      //If initially nothing is there then no operation will work.
      if (state.currentOperand == null && state.previousOperand == null)
        return state;

      //If there is previousOperand and then we select the operation, if we want to change the operation it will overwrite the previous.
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      //Changes the currentOperand to previousOperand when any operation is selected.
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      //If previousOperand and currentOperand is there and then we select another operation then the previous calcution is evaluated.
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };


    //Evaluation action
    case ACTIONS.EVALUATE:
      //If currentOperand or previousOperand or operation is absent then evaluation is not possible.
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      )
        return state;

      //Passing the state to evaluation function.
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };


    //Delete action
    case ACTIONS.DELETE_DIGIT:
      //If the solution of the previous calculation is there, then if we click del, then the currentOperand is null.
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      //If currentOperand is null nothing happens.
      if (state.currentOperand == null) return state;

      //If there is one digit in currentOperand then the currentOperand is null on del.
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      //Delete the last element form currentOperand.
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };


    //It clears all the previous calculation.
    case ACTIONS.CLEAR:
      return {};

    default:
      break;
  }
}



//All the evaluation operations.
function evaluate({ currentOperand, previousOperand, operation }) {
  //Convert the string to float.
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  //If previousOperand or currentOperand is absent return empty string or nothing.
  if (isNaN(prev) || isNaN(current)) return "";

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;

    case "-":
      computation = prev - current;
      break;

    case "*":
      computation = prev * current;
      break;

    case "÷":
      computation = prev / current;
      break;

    default:
      break;
  }

  //Return computation or result in form of string.
  return computation.toString();
}



//Used to add commas in digits like (100,000,000).
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});


//Function to add commas in digits like (100,000,000).
function formatOperand(operand) {
  //If no digit return nothing.
  if (operand == null) return;

  //Split the digits into integers and decimals
  const [integer, decimal] = operand.split(".");

  //If no decimal in digit.
  if (decimal == null) return INTEGER_FORMATTER.format(integer);

  //If integer and decimal exist.(decimal don't have commas)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}



//Main function.
function App() {
  
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer,{});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operands">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operands">{formatOperand(currentOperand)}</div>
      </div>

      <button
        className="span-two"
        onClick={() => dispatch({ types: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ types: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButtton digit="1" dispatch={dispatch} />
      <DigitButtton digit="2" dispatch={dispatch} />
      <DigitButtton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButtton digit="4" dispatch={dispatch} />
      <DigitButtton digit="5" dispatch={dispatch} />
      <DigitButtton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButtton digit="7" dispatch={dispatch} />
      <DigitButtton digit="8" dispatch={dispatch} />
      <DigitButtton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButtton digit="." dispatch={dispatch} />
      <DigitButtton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ types: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
