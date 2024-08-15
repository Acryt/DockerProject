import classes from "./Form.module.scss";

import { FormPropsType, StatusType, VoteType } from "../../Utilites/Types";

export function Form(props: FormPropsType) {

	function submitHandler(e: any) {
		e.preventDefault();
		console.log(e);
		
		const formData = new FormData(e.target);
		const date = new Date(formData.get('date') as string);
		console.log(formData);
		
		props.submit({
			title: formData.get("title") as string,
			status: formData.get("status") as StatusType,
			date,
		});
	}

	return (
		<form className={classes.Form} onSubmit={submitHandler}>
			{props.children}
		</form>
	);
}

export default Form;
