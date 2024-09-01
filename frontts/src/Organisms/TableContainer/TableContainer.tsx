import classes from "./TableContainer.module.scss";

import { CategoryType, StateType } from "../../Utilites/Types";
import Select from "../../Atoms/Select/Select";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

type TableContainerPropsType = {
	children?: React.ReactNode;
	state: StateType;
};

export function TableContainer(props: TableContainerPropsType) {
	const [activeCategoryId, setActiveCategoryId] = useState<string>("");

	useEffect(() => {
		if (props.state.length > 0) {
			setActiveCategoryId(props.state[0]._id!);
		}
	}, [props.state]);

	function selectHandler(e: any) {
		setActiveCategoryId(e.target.value);
		console.log(e.target.value);
	}
	function getCandidateName(candidateId: string) {
		return props.state
			.find((category) => category._id === activeCategoryId)
			?.candidates.find((candidate) => candidate._id === candidateId)?.name;
	}

	return (
		<div className={classes.TableContainer}>
			<Select name="table" change={selectHandler}>
				{props.state.map((category: CategoryType) => (
					<option value={category._id}>{category.title}</option>
				))}
			</Select>

			{/* вывод таблицы суммы тикетов за каждого отдельного кандидата */}
			<table>
				<thead>
					<tr>
						<th>Candidate</th>
						<th>Votes</th>
					</tr>
				</thead>
				<tbody>
					{props.state
						.find((category) => category._id === activeCategoryId)
						?.candidates.map((candidate) => (
							<tr>
								<td>{candidate.name}</td>
								<td>
									{
										props.state
											.find(
												(category) =>
													category._id === activeCategoryId
											)
											?.tickets.filter(
												(ticket) =>
													ticket.candidateId === candidate._id
											).length
									}
								</td>
							</tr>
						))}
				</tbody>
			</table>
			{props.children}
		</div>
	);
}

export default TableContainer;
