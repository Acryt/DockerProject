import { MouseEventHandler } from "react";
import Button from "../Button/Button";
import classes from "./Dialog.module.scss";
type DialogPropsType = {
	title: string;
	ok?: MouseEventHandler<HTMLButtonElement>;
	cancel?: MouseEventHandler<HTMLButtonElement>;
};
export function Dialog(props: DialogPropsType) {
	return (
		<dialog open>
			<p>{props.title}</p>
			{props.cancel ? <Button click={props.cancel}>Cancel</Button> : ""}
			{props.ok ? <Button click={props.ok}>Ok</Button> : ""}
		</dialog>
	);
}

export default Dialog;
