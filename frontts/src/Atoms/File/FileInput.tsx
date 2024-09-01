import classes from "./FileInput.module.scss";
import { InputPropsType } from "../../Utilites/Types";
import { useState } from "react";

export function FileInput(props: InputPropsType) {
	const [stateValue, setStateValue] = useState("");
	const [fileName, setFileName] = useState("");

	function changeHandler(e: any) {
		console.log("input change");
		setStateValue(e.target.value);
		if (e.target.files && e.target.files.length > 0) {
			setFileName(e.target.files[0].name);
		}
	}

	return (
		<input
			className={classes.File}
			onChange={changeHandler}
			name={props.name}
			type="file"
			placeholder={props.placeholder}
			required={props.required}
		/>
	);
}

export default FileInput;
