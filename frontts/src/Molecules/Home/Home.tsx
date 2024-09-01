import classes from "./Home.module.scss";
import image from "./qiqi.png";

function Home() {
	return (
		<>
			<img className={classes.Home} src={image} alt="image" />
		</>
	);
}

export default Home;
