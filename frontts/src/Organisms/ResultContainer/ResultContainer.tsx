import { useEffect, useState } from "react";
import Center from "../Center/Center"
import TableContainer from "../TableContainer/TableContainer"
import { CategoryType, CandidateType } from "../../Utilites/Types";

type ResultContainerPropsType = {
	children?: React.ReactNode
	stateCategory: Array<CategoryType>
	stateCandidate: Array<CandidateType>
	changeActiveCategory: Function
}
export default function ResultContainer(props: ResultContainerPropsType) {
	const [pass, setPass] = useState<string>("");
	const [currentValidPass, setCurrentValidPass] = useState<string>("123");
	function passwordHandler(e: any) {
		setPass(e.target.value);
	} 
	useEffect(() => {
		setCurrentValidPass(localStorage.getItem("pass") || "123")
	}, [pass]);

	return (
		<Center>
		<input
			type="password"
			name="pass"
			value={pass}
			placeholder="Password"
			onChange={passwordHandler}
		/>
		{pass === currentValidPass ? (
			<TableContainer
				stateCandidate={props.stateCandidate}
				stateCategory={props.stateCategory}
				changeActiveCategory={props.changeActiveCategory}
			/>
		) : (
			<p>Wrong password</p>
		)}
	</Center>
	)
}