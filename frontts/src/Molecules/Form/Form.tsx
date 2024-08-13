import classes from "./Form.module.scss";
import axios from "axios";

function Form(prop: any) {
   const handleSubmit = async (event: any) => {
		event.preventDefault();
      try {
         const form = event.target.form;
         const data = new FormData(form);
         const title = data.get("title");
         const date = data.get("date");
         const status = data.get("status");
         console.log(title, date, status);
         const response = await axios.post('http://acryt.local/api/postData', {
            title: title,
            date: date,
            status: status
         });
         console.log(response);
         event.target.form.reset();
      } catch (error) {
         console.error(error);
      }
	}
	return (
		<form className={classes.Form}>
			<p>Form</p>
			<input type="text" name="title" placeholder="title" />
			<input type="date" name="date" placeholder="date" />
			<input type="text" name="status" placeholder="status" />
			<input type="submit" value="Submit" onClick={handleSubmit} />
			{prop.children}
		</form>
	);
}

export default Form;
