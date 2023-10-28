import { useEffect } from "react";

import auth from "./providers/auth";

function App() {
	// Unsubscribe from auth on unmount
	useEffect(() => auth.destroy, []);

	return <></>;
}

export default App;
