import { Form } from "../../Molecules/Form/Form";
import Button from "../../Atoms/Button/Button";
import Input from "../../Atoms/Input/Input";
import Center from "../Center/Center";
import classes from "./AdminContainer.module.scss";
import axios from "axios";
import { logsType } from "../../Utilites/Types";
import { useRef, useState } from "react";
type AdminContainerProps = {
	setLogs: Function;
	logs: logsType[];
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

	const adminPass = "admin";

	function addBatch(b: BatchType) {
		console.log("addBatch");
		axios
			.post("/api/addBatch", b)
			.then(() => {
				props.setLogs([
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
				props.setLogs([
					...props.logs,
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
					<input
						ref={ref}
						type="text"
						name="pass"
						placeholder="change pass"
					/>
					<button onClick={changePassHandler}>Changer</button>
				</>
			) : (
				<p>Wrong password</p>
			)}
		</Center>
	);
}
