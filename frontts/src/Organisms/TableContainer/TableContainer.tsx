import classes from "./TableContainer.module.scss";

import { CandidateType, CategoryType, TicketType } from "../../Utilites/Types";
import Select from "../../Atoms/Select/Select";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Input from "../../Atoms/Input/Input";

type TableContainerPropsType = {
	children?: React.ReactNode;
	stateCategory: Array<CategoryType>;
	stateCandidate: Array<CandidateType>; // удалить
	changeActiveCategory: Function;
};

export function TableContainer(props: TableContainerPropsType) {
	const [activeCategoryId, setActiveCategoryId] = useState<
		string | undefined
	>();
	const [votes, setVotes] = useState<Array<TicketType>>([]);
	const [candidates, setCandidates] = useState<Array<CandidateType>>([]);
	const [results, setResults] = useState<any>([]);
	let filteredCandidates: Array<CandidateType> = [];

	useEffect(() => {
		let promise = axios.get("/api/getCandidate/");
		promise
			.then((res: AxiosResponse<any>) => {
				const candidates = res.data;
				if (candidates) {
					setCandidates(candidates);
				}
			})
			.catch((err) => console.log(err.error));

		promise = axios.get("/api/getVote/");
		promise
			.then((res: AxiosResponse<any>) => {
				const votes = res.data;
				if (votes) {
					setVotes(votes);
				}
				let x =
					props.stateCategory !== undefined &&
					props.stateCategory.length > 0
						? props.stateCategory[0]._id
						: undefined;
				console.log(x);
				setActiveCategoryId(x);
			})
			.catch((err) => console.log(err.error));
	}, []);

	useEffect(() => {
		filteredCandidates = candidates.filter(
			(candidate) => candidate.categoryId === activeCategoryId
		);
		console.log(filteredCandidates);
		calculateVotes(filteredCandidates, votes);
	}, [activeCategoryId]);

	const calculateVotes = (candidates: Array<Object>, votes: Array<Object>) => {
		candidates.forEach((c: any) => {
			c.votes = 0;
			votes.forEach((v: any) => {
				if (c._id === v.candidateId && c.categoryId === v.categoryId) {
					c.votes = c.votes + 1;
				}
			});
		});
		candidates.sort((a: any, b: any) => b.votes - a.votes);
		setResults(candidates);
	};

	function selectHandler(e: any) {
		setActiveCategoryId(e.target.value);
		console.log(e.target.value);
	}
	function getCandidateName(candidateId: string) {
		return candidates.find((candidate) => candidate._id === candidateId)
			?.name;
	}

	return (
		<div className={classes.TableContainer}>
			{props.children}
			<>
				<Select name="table" change={selectHandler}>
					{props.stateCategory !== undefined &&
						props.stateCategory.map((c: CategoryType) => (
							<option value={c._id}>{c.title}</option>
						))}
				</Select>
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Candidate</th>
							<th>Votes</th>
						</tr>
					</thead>
					<tbody>
						{results.map((c: any, i: number) => (
							<tr>
								<td>{i + 1}.</td>
								<td>{c.name}</td>
								<td>{c.votes}</td>
							</tr>
						))}
					</tbody>
				</table>
			</>
		</div>
	);
}

export default TableContainer;
