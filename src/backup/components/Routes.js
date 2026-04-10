import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import AccessDenied from "./AccessDenied";
const Login = lazy(() => import("./Login"));
const Employees = lazy(() => import("./Employees"));
const Leaves = lazy(() => import("./Leaves"));
const ChangePassword = lazy(() => import("./ChangePassword"));
const ApproveLeaveSupervisor = lazy(() => import("./ApproveLeaveSupervisor"));
const ApproveLeaveHr = lazy(() => import("./ApproveLeaveHr"));
const Payslip = lazy(() => import("./Payslip"));

const checkAuth = (props) => {
  let isLoggedIn = false;
  const tokenid = localStorage.getItem("tokenid");

  if (tokenid === null) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }

  return isLoggedIn;
};

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      checkAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
          }}
        />
      )
    }
  />
);

const Routes = () => {
  return (
    <Switch>
      <AuthRoute
        exact
        strict
        path="/"
        component={Home}
        render={() => <Home />}
      />

      <AuthRoute
        exact
        strict
        path="/accessdenied"
        component={AccessDenied}
        render={() => <AccessDenied />}
      />

      <Suspense
        fallback={
          <div className="text-center font-bold text-md">Loading page...</div>
        }
      >
        <AuthRoute
          exact
          strict
          path="/leaves"
          component={Leaves}
          render={() => <Leaves />}
        />
        <Route
          exact
          strict
          path="/login"
          component={Login}
          render={() => <Login />}
        />
        <AuthRoute
          exact
          strict
          path="/employees"
          component={Employees}
          render={() => <Employees />}
        />
        <AuthRoute
          exact
          strict
          path="/changepassword"
          component={ChangePassword}
          render={() => <ChangePassword />}
        />
        <AuthRoute
          exact
          strict
          path="/approveleavesupervisor"
          component={ApproveLeaveSupervisor}
          render={() => <ApproveLeaveSupervisor />}
        />

        <AuthRoute
          exact
          strict
          path="/approveleavehr"
          component={ApproveLeaveHr}
          render={() => <ApproveLeaveHr />}
        />

        <AuthRoute
          exact
          strict
          path="/payslip"
          component={Payslip}
          render={() => <Payslip />}
        />
      </Suspense>
    </Switch>
  );
};

export default Routes;
