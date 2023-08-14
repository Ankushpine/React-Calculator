import { ACTIONS } from "./App.jsx";

export default function DigitButtton({ dispatch, digit }) {
  return (
    <button
      onClick={() =>
        dispatch({ types: ACTIONS.ADD_DIGITS, payload: { digit } })
      }
    >
      {digit}
    </button>
  );
}
