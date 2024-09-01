import classes from "./Button.module.scss";

import { ButtonPropsType } from "../../Utilites/Types";

export function Button(props: ButtonPropsType) {

	function clickHandler(e: any) {
		if (props.click) {
			props.click(e);
		}
	}

	return (
		<button className={classes.Button} type={props.typeButton} onClick={clickHandler} name={props.name} value={props.value}>
			{props.title}
			{props.children}
		</button>
	);
}

export default Button;
