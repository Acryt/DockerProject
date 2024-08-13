import classes from "./Section.module.scss";
import Form from "../../Molecules/Form/Form";

function Section(prop) {
	return (
		<section className={classes.Section}>
			<Form/>
			{prop.children}
		</section>
	);
}

export default Section;
