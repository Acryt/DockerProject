import { Form } from "../../Molecules/Form/Form";
import Button from "../../Atoms/Button/Button";
import Input from "../../Atoms/Input/Input";
import Center from "../Center/Center";
import classes from "./AdminContainer.module.scss";
import axios from "axios";
import { logsType } from "../../Utilites/Types";
import { useRef, useState } from "react";
import Dialog from "../../Atoms/Dialog/Dialog";
import { v4 } from "uuid";
type AdminContainerProps = {
	addLogs: Function;
	logs: logsType[];
	adminMode: boolean;
	setAdminMode: Function;
	children?: React.ReactNode;
};
type BatchType = {
	prefix: string;
	min: string;
	max: string;
};
export default function AdminContainer(props: AdminContainerProps) {
	const [inputPass, setInputPass] = useState<string>("");
	const ref = useRef<HTMLInputElement>(null);
	let [title, setTitle] = useState<string>("");
	let [drop, setDrop] = useState<string>("");

	const adminPass = "admin";

	function addBatch(b: BatchType) {
		console.log("addBatch");
		axios
			.post("/api/addBatch", b)
			.then(() => {
				props.addLogs([
					...props.logs,
					{
						msg:
							"Added tickets from " +
							b.prefix +
							b.min +
							" to " +
							b.prefix +
							b.max,
					},
				]);
			})
			.catch((err) => {
				props.addLogs([
					{ err: "Error: " + err.response.data.message },
				]);
			});
	}

	function changePassHandler() {
		let inputElemValue = ref.current?.value;
		if (!inputElemValue) return;
		localStorage.setItem("pass", inputElemValue);
	}

	return (
		<Center>
			<input
				type="password"
				name="pass"
				placeholder="Password"
				value={inputPass}
				onChange={(e) => setInputPass(e.target.value)}
			/>
			{inputPass === adminPass ? (
				<>
					<Form submit={addBatch}>
						<Input
							type="text"
							name="prefix"
							placeholder="prefix"
							value=""
							required
						/>
						<Input
							type="text"
							name="min"
							placeholder="min"
							value=""
							required
						/>
						<Input
							type="text"
							name="max"
							placeholder="max"
							value=""
							required
						/>
						<Button>Add</Button>
					</Form>
					<div className={classes.AdminContainer}>
						<p>Admin Mode</p>
						<input
							type="checkbox"
							checked={props.adminMode}
							onChange={(e) => {
								props.setAdminMode(e.target.checked);
							}}
						/>
						<input ref={ref} type="text" placeholder="Result Pass" />
						<Button click={changePassHandler}>Set</Button>
						<div className={classes.AdminContainer_btns}>
							<Button
								click={() => {
									setDrop("votes");
									setTitle("Are you sure you want to drop all votes?");
								}}
							>
								Drop Votes
							</Button>
							<Button
								click={() => {
									setDrop("tickets");
									setTitle(
										"Are you sure you want to drop all Tickets from Batch?"
									);
								}}
							>
								Drop Tickets
							</Button>
							<Button
								click={() => {
									setDrop("db");
									setTitle("Are you sure you want to drop DB?");
								}}
							>
								Drop DB
							</Button>
						</div>
					</div>
					{drop && (
						<Dialog
							key={v4()}
							title={title}
							cancel={() => setDrop("")}
							ok={() => {
								switch (drop) {
									case "votes":
										fetch("/api/dropVotes", {
											method: "GET",
										})
											.then((response) => response.json())
											.then(() => props.addLogs({msg: "All Votes Dropped"}))
											.catch((error) => props.addLogs(error));
										break;
									case "tickets":
										fetch("/api/dropBatch", {
											method: "GET",
										})
											.then((response) => response.json())
											.then(() => props.addLogs({msg: "Tickets Dropped"}))
											.catch((error) => props.addLogs(error));
										break;
									case "db":
										fetch("/api/dropBase", {
											method: "GET",
										})
											.then((response) => response.json())
											.then(() => props.addLogs({msg: "All DB Dropped"}))
											.catch((error) => props.addLogs(error));
										break;

									default:
										break;
								}
								setDrop("");
							}}
						/>
					)}
				</>
			) : (
				<p>Wrong password</p>
			)}
		</Center>
	);
}
