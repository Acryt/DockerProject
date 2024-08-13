import "./Button.scss";

function Button(prop) {
	return (
		<button className="Button">
			{prop.children}
		</button>
	);
}

export default Button;
