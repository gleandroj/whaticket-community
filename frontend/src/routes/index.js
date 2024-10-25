import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../context/Auth/AuthContext";
import { SocketIOProvider } from "../context/SocketIO/SocketIOContext";
import { WhatsAppsProvider } from "../context/WhatsApp/WhatsAppsContext";
import LoggedInLayout from "../layout";
import Companies from "../pages/company";
import Connections from "../pages/Connections/";
import Contacts from "../pages/Contacts/";
import Dashboard from "../pages/Dashboard/";
import Login from "../pages/Login/";
import Queues from "../pages/Queues/";
import QuickAnswers from "../pages/QuickAnswers/";
import Settings from "../pages/Settings/";
import Signup from "../pages/Signup/";
import Tickets from "../pages/Tickets/";
import Users from "../pages/Users";
import Route from "./Route";

const Routes = () => {
  return (
    <BrowserRouter>
      <SocketIOProvider>
        <AuthProvider>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <WhatsAppsProvider>
              <LoggedInLayout>
                <Route exact path="/" component={Dashboard} isPrivate />
                <Route
                  exact
                  path="/tickets/:ticketId?"
                  component={Tickets}
                  isPrivate
                />
                <Route
                  exact
                  path="/connections"
                  component={Connections}
                  isPrivate
                />
                <Route exact path="/contacts" component={Contacts} isPrivate />
                <Route exact path="/users" component={Users} isPrivate />

                <Route
                  exact
                  path="/companies"
                  component={Companies}
                  isPrivate
                />
                <Route
                  exact
                  path="/quickAnswers"
                  component={QuickAnswers}
                  isPrivate
                />
                <Route exact path="/Settings" component={Settings} isPrivate />
                <Route exact path="/Queues" component={Queues} isPrivate />
              </LoggedInLayout>
            </WhatsAppsProvider>
          </Switch>
          <ToastContainer autoClose={3000} />
        </AuthProvider>
      </SocketIOProvider>
    </BrowserRouter>
  );
};

export default Routes;
