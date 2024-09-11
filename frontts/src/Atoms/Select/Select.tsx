import classes from "./Select.module.scss";
import { useState } from "react";

// import { SelectPropsType } from "../../Utilites/Types";

type SelectPropsType = {
	name: string;
	change?: any;
	children?: any;
	required?: boolean;
};
export function Select(props: SelectPropsType) {
	const [selectValue, setSelectValue] = useState<string>("");

	function selectHandler(e: any) {
		setSelectValue(e.target.value);
		if (props.change) {
			props.change(e);
		} 
	}

	return (
		<select
			className={classes.Select}
			name={props.name}
			onChange={selectHandler}
			value={selectValue}
			required={props.required}
		>
			{props.children}
		</select>
	);
}

export default Select;