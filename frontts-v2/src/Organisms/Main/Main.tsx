import classes from "./Main.module.scss";

import { MainPropsType } from "../../Utilites/Types";

function Main(props: MainPropsType) {
	return <main className={classes.Main}>{props.children}</main>
}

export default Main;
