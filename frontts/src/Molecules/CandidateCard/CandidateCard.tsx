import classes from "./CandidateCard.module.scss";

import { CandidateType } from "../../Utilites/Types";

type CandidateCardPropsType = {
	children?: React.ReactNode;
	candidate: string | undefined;
	stateCandidate: Array<CandidateType>;
}

export function CandidateCard(props: CandidateCardPropsType) {
	const с = props.stateCandidate.find((c) => c._id === props.candidate);

	function bufferToBase64(data: any) {
		const buffer = new Uint8Array(data);
		const base64 = btoa(String.fromCharCode(...buffer));
		return base64;
	}
	function getImgString(c: CandidateType) {
		const str = "data:" + c.file.mimetype + ";base64," + bufferToBase64(c.file.buffer.data);
		return str;
	 };

	return (
      <div className={classes.CandidateCard}>
			<div className={classes.Img}>
				<img src={getImgString(с!)} />
			</div>
         <p>{с?.name}</p>
         {props.children}
         <p className="s">{с?._id}</p>
      </div>
		);
}

export default CandidateCard;
