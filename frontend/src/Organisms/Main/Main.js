import classes from "./Main.module.scss";
import Sidebar from "../../Molecules/Sidebar/Sidebar";
import Menu from "../../Molecules/Menu/Menu";
import Section from "../Section/Section";


function Main(prop) {
	return (
		<main className={classes.Main}>
		<Menu/>
		<Section/>
		<Sidebar/>
		</main>
	);
}

export default Main;
