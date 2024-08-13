import classes from "./Menu.module.scss";

function Menu(prop) {
	return (
		<nav className={classes.Menu}>
			<p>Menu</p>
			{prop.children}
		</nav>
	);
}

export default Menu;
