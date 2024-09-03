import classes from "./TableContainer.module.scss";

import { CandidateType, CategoryType, TicketType } from "../../Utilites/Types";
import Select from "../../Atoms/Select/Select";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Input from "../../Atoms/Input/Input";

type TableContainerPropsType = {
	children?: React.ReactNode;
	stateCategory: Array<CategoryType>;
	stateCandidate: Array<CandidateType>;
	changeActiveCategory: Function;
};

export function TableContainer(props: TableContainerPropsType) {
	const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>();
	const [votes, setVotes] = useState<Array<TicketType>>([]);

	useEffect(() => {
		setActiveCategoryId(props.stateCategory !== undefined && props.stateCategory.length > 0 ? props.stateCategory[0]._id : undefined);
	}, []);

	useEffect(() => {
		if (activeCategoryId !== "") {
			console.log(activeCategoryId);
			let promise = axios.get("/api/getVote/" + activeCategoryId);
			promise
				.then((res: AxiosResponse<any>) => {
					setVotes(res.data);
				})
				.catch((err) => console.log(err.error));
		}
	}, [activeCategoryId]);

	function selectHandler(e: any) {
		setActiveCategoryId(e.target.value);
		console.log(e.target.value);
	};
	function getCandidateName(candidateId: string) {
		return props.stateCandidate.find(
			(candidate) => candidate._id === candidateId
		)?.name;
	}

	return (
		<div className={classes.TableContainer}>
			{props.children}
				<>
					<Select name="table" change={selectHandler}>
						{props.stateCategory !== undefined && props.stateCategory.map((c: CategoryType) => (
							<option value={c._id}>{c.title}</option>
						))}
					</Select>
					<table>
						<thead>
							<tr>
								<th>Candidate</th>
								<th>Votes</th>
							</tr>
						</thead>
						<tbody>
							{props.stateCandidate
								.filter((ca) => ca.categoryId === activeCategoryId)
								?.map((c) => (
									<tr>
										<td>{c.name}</td>
										<td>{votes.length}</td>
									</tr>
								))}
						</tbody>
					</table>
				</>
		</div>
	);
}

export default TableContainer;
