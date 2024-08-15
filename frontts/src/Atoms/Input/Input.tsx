import classes from "./Input.module.scss";
import { InputPropsType } from "../../Utilites/Types";
import { useState } from "react";

export function Input(props: InputPropsType) {
	const [stateValue, setStateValue] = useState('');

	function changeHandler(e: any) {
		console.log("input change");
		setStateValue(e.target.value);
	}

	return (
		<input className={classes.Input} onChange={changeHandler} value={stateValue} name={props.name} type={props.typeInput} placeholder={props.placeholder}/>
	);
}

export default Input;
