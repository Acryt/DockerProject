import classes from "./TableContainer.module.scss";

import { CandidateType, CategoryType, TicketType } from "../../Utilites/Types";
import Select from "../../Atoms/Select/Select";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Input from "../../Atoms/Input/Input";

type TableContainerPropsType = {
	children?: React.ReactNode;
	stateCategory: Array<CategoryType>;
	stateCandidate: Array<CandidateType>;
	changeActiveCategory: Function;
};

export function TableContainer(props: TableContainerPropsType) {
	const [activeCategoryId, setActiveCategoryId] = useState<
		string | undefined
	>();
	const [votes, setVotes] = useState<Array<TicketType>>([]);
	const [candidates, setCandidates] = useState<Array<CandidateType>>([]);
	const [results, setResults] = useState<any>([]);

	useEffect(() => {
		setActiveCategoryId(
			props.stateCategory !== undefined && props.stateCategory.length > 0
				? props.stateCategory[0]._id
				: undefined
		);
	}, []);

	useEffect(() => {
		if (activeCategoryId !== "") {
			console.log(activeCategoryId);
			let promise = axios.get("/api/getVote/" + activeCategoryId);
			promise
				.then((res: AxiosResponse<any>) => {
					const votes = res.data;
					if (votes) {
						setVotes(votes);
					}
				})
				.catch((err) => console.log(err.error));

			promise = axios.get("/api/getCandidates/" + activeCategoryId);
			promise
				.then((res: AxiosResponse<any>) => {
					const candidates = res.data;
					if (candidates) {
						setCandidates(candidates);
					}
				})
				.catch((err) => console.log(err.error));
		}
	}, [activeCategoryId]);

	const calculateVotes = useCallback((
		candidates: Array<Object>,
		votes: Array<Object>
	) => {
		candidates.forEach((c: any) => {
			c.votes = 0;
			votes.forEach((v: any) => {
				if (c._id === v.candidateId) {
					c.votes = c.votes + 1;
				}
			});
		});
		candidates.sort((a: any, b: any) => b.votes - a.votes);
		setResults(candidates);
		console.log(candidates);
	}, [candidates, votes]);

	useEffect(() => {
		calculateVotes(candidates, votes);
	}, [activeCategoryId]);

	// Нужно подсчтитать сколько голосов у каждого кандидата в активной категории и запихнуть эти подсчеты в массив имя кандидата и кол-во голосов

	function selectHandler(e: any) {
		setActiveCategoryId(e.target.value);
		console.log(e.target.value);
	}
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
					{props.stateCategory !== undefined &&
						props.stateCategory.map((c: CategoryType) => (
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
						{results.map((c:any) => (
							<tr>
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
