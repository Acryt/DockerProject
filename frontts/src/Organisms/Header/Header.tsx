import classes from "./Header.module.scss";

type HeaderPropsType = {
	title?: string;
}
function Header(prop: HeaderPropsType) {
	return (
		<header className={classes.Header}>
			<h1 className={classes.Header__title}>{prop.title}</h1>
		</header>
	);
}

export default Header;
