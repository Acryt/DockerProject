import classes from "./Sidebar.module.scss";
import axios from "axios";

function Sidebar(prop) {
	const handlerGetData = async () => {
		try {
			const response = await axios.get("/api/getData");
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	// axios.get("/api/getData").then((response) => {
	// 	res.json({
	// 		testCurrentUser: true,
	// 		user: response.data,
	// 	});
	// });

	return (
		<aside className={classes.Sidebar}>
			<p>Sidebar</p>
			<button onClick={handlerGetData}>GetData</button>
			{prop.children}
		</aside>
	);
}

export default Sidebar;
