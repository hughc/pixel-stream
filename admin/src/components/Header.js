import { Component } from "react";

export default class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div className='header u-pad--20'>
			<h1>{this.props.title}</h1>	
		</div>
	}
}