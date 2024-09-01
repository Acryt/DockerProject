import classes from "./Menu.module.scss";

type MenuPropsType = {
	children?: React.ReactNode;
}

function Menu(prop: MenuPropsType) {
	return (
		<nav className={classes.Menu}>
			<h3>Menu</h3>
			{prop.children}
		</nav>
	);
}

export default Menu;
