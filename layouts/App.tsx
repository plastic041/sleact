import { Redirect, Route, Switch } from "react-router-dom";

import DirectMessage from "@pages/DirectMessage";
import SignIn from "@pages/SignIn";
import SignUp from "@pages/SignUp";
import Workspace from "@layouts/Workspace";

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/signin" />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  );
};

export default App;
