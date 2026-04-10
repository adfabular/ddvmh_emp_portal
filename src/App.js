/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import "antd/dist/antd.css";
import { withRouter } from "react-router-dom";
import { Layout, Menu, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Routes from "./components/Routes";
import Loader from "react-loader-spinner";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "./actions";
const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;
const App = (props) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const showSpin = useSelector((state) => state.showSpin);
  const handleNavigatePage = (page) => {
    props.history.push(page);
  };
  const handleChangeUserProfile = () => {};
  const handleLogOut = () => {
    Modal.confirm({
      title: "Logout system now?",
      icon: <ExclamationCircleOutlined />,

      onOk() {
        dispatch(updateUser({}));
        localStorage.removeItem("tokenid");
        props.history.push("/login");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleChangePassword = () => {
    props.history.push("/changepassword");
  };
  useEffect(() => {}, []);
  return (
    <div className="App">
      <Layout>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="keyHome" onClick={() => handleNavigatePage("/")}>
              Home
            </Menu.Item>
            {userDetails.empLastNm === undefined && (
              <>
                <Menu.Item
                  style={{ float: "right" }}
                  onClick={() => handleNavigatePage("/login")}
                  key="mnuLogin"
                >
                  Login
                </Menu.Item>
              </>
            )}

            {userDetails.empLastNm !== undefined && (
              <>
                <SubMenu key="SubMenu" title="File">
                  <Menu.Item
                    key="keyEmployees"
                    onClick={() => handleNavigatePage("/employees")}
                  >
                    Employees
                  </Menu.Item>
                </SubMenu>
                <Menu.Item
                  key="keyLeaves"
                  onClick={() => handleNavigatePage("/leaves")}
                >
                  My Leaves
                </Menu.Item>
                <Menu.Item
                  key="keyPayslip"
                  onClick={() => handleNavigatePage("/payslip")}
                >
                  My Payslips
                </Menu.Item>
                {(userDetails.SupervisorApproveLeave === true ||
                  userDetails.HrApproveLeave === true) && (
                  <SubMenu key="subMenuApproveLeave1" title="Approve Leave">
                    {userDetails.SupervisorApproveLeave === true && (
                      <Menu.Item
                        key="keyApproveLeaveSupervisor"
                        onClick={() => {
                          props.history.push({
                            pathname: "/approveleavesupervisor",
                            state: {
                              mode: "supervisor",
                            },
                          });
                        }}
                      >
                        Supervisor
                      </Menu.Item>
                    )}
                    {userDetails.HrApproveLeave === true && (
                      <Menu.Item
                        key="keyApproveLeaveHr"
                        onClick={() => {
                          props.history.push({
                            pathname: "/approveleavehr",
                            state: {
                              mode: "hr",
                            },
                          });
                        }}
                      >
                        HR
                      </Menu.Item>
                    )}
                  </SubMenu>
                )}

                <SubMenu
                  style={{ float: "right" }}
                  key="mnuUser"
                  title={userDetails.empLastNm}
                >
                  <Menu.Item key="keyLogOut" onClick={() => handleLogOut()}>
                    Logout
                  </Menu.Item>

                  <Menu.Item
                    key="keyChangePassword"
                    onClick={() => handleChangePassword()}
                  >
                    Change Password
                  </Menu.Item>
                </SubMenu>
              </>
            )}
          </Menu>
        </Header>
        <Content
          className="site-layout"
          style={{ padding: "0 0px", marginTop: 64 }}
        >
          <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: 380 }}
          >
            <div
              style={{
                position: "fixed",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              {showSpin && (
                <Loader type="Puff" color="#00BFFF" height={80} width={80} />
              )}
            </div>
            <Routes />
          </div>
        </Content>
        <div>
          <Footer style={{ textAlign: "center" }}>Employee Portal ©2021</Footer>
        </div>
      </Layout>
    </div>
  );
};

export default withRouter(App);
