import classes from "./Form.module.scss";

import { FormPropsType, StatusType } from "../../Utilites/Types";
import { v4 } from "uuid";

export function Form(props: FormPropsType) {
	function submitHandler(e: any) {
		e.preventDefault();
		console.log(e);

		const formData = new FormData(e.target);
		const data: any = {};

		for (const [key, value] of Array.from(formData.entries())) {
			if (key === "date") {
				data[key] = new Date(value as string);
			} else {
				data[key] = value;
			}
		}

		console.log(data);
		props.submit(data);
	}

	return (
		<form className={classes.Form} onSubmit={submitHandler}>
			{props.children}
		</form>
	);
}

export default Form;
