import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignIn } from "./page/authentication/signin";
import { SignUp } from "./page/authentication/signup";
import { ProfileCompletion } from "./page/authentication/profilecompletion";
import { Dashboard } from "./page/dashboard";
import { Connection } from "./page/connection";
import { SavedView } from "./page/savedview";
import { Setting } from "./page/setting";
import { RouteProtector } from "./config/routeProtector";
import { QueryResult } from "./page/queryresult";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/complete-profile/:id" element={<ProfileCompletion />} />
				<Route element={<RouteProtector />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/connection" element={<Connection />} />
					<Route path="/saved-view" element={<SavedView />} />
					<Route path="/saved-view/:queryId" element={<QueryResult />} />
					<Route path="/setting" element={<Setting />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
