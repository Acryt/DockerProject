import { v4 } from "uuid";
import classes from "./Select.module.scss";
import { useState } from "react";

// import { SelectPropsType } from "../../Utilites/Types";

type SelectPropsType = {
	name: string;
	click?: any;
	children?: any;
};
export function Select(props: SelectPropsType) {
	const [selectValue, setSelectValue] = useState<string>("");

	function selectHandler(e: any) {
		console.log("select change");
		setSelectValue(e.target.value);
		if (props.click) {
			props.click(e);
		}
	}

	return (
		<select
			className={classes.Select}
			name={props.name}
			onChange={selectHandler}
			value={selectValue}
		>
			{props.children}
		</select>
	);
}

export default Select;