import classes from "./Footer.module.scss";

function Footer(prop: any) {
	return (
		<footer className={classes.Footer}>
			<p>created by Acryt</p>
			{prop.children}
		</footer>
	);
}

export default Footer;
