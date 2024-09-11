import classes from "./Input.module.scss";
import { InputPropsType } from "../../Utilites/Types";
import { useCallback, useMemo, useState } from "react";
import React from "react";

const Input = React.memo((props: InputPropsType) => {
	const [stateValue, setStateValue] = useState('');
	console.log('render ' + props.name);
	
	const changeHandler = useCallback((e: any) => {
		console.log("input change");
		setStateValue(e.target.value);
		if (props.onChange) {
		  props.onChange(e.target.value);
		}
	 }, [props]);

	return (
		<input className={classes.Input} onChange={changeHandler} value={stateValue} name={props.name} type={props.type} placeholder={props.placeholder} required={props.required}/>
	);
})

export default Input;
