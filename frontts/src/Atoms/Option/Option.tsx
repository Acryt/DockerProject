import classes from "./Option.module.scss";

import { OptionPropsType } from "../../Utilites/Types";

export function Option(props: OptionPropsType) {
	return (
		<option className={classes.Option} value={props.value}>
			{props.title}
		</option>
	);
}

export default Option;
