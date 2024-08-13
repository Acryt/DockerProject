import classes from "./Menu.module.scss";

function Menu(prop: any) {
	return (
		<nav className={classes.Menu}>
			<p>Menu</p>
			<button>List Votes</button>
			<button>List Candidates</button>
			<button>List Voters</button>
			{prop.children}
		</nav>
	);
}

export default Menu;
