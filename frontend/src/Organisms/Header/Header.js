import classes from "./Header.module.scss";

function Header(prop) {
	return (
		<header className={classes.Header}>
			<h1 className={classes.Header__title}>Header</h1>
			{prop.children}
		</header>
	);
}

export default Header;
