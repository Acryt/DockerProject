import classes from "./Menu.module.scss";
import { ViewType } from "../../Utilites/Types";

type MenuPropsType = {
	view: ViewType;
	children?: React.ReactNode;
}

function Menu(prop: MenuPropsType) {
	return (
		<nav className={classes.Menu}>
			<p>Menu</p>
			{prop.children}
		</nav>
	);
}

export default Menu;
