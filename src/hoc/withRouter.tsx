import React from "react";
import {
	useParams
} from "react-router-dom";

export function withRouter(Component: typeof React.Component) {
	function ComponentWithRouterProp(props: any) {
		let params = useParams();
		return (
			<Component
				{...props}
				router={{ params }}
			/>
		);
	}

	return ComponentWithRouterProp;
}