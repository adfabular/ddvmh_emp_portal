/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  message,
  Input,
  Button,
  Modal,
  Checkbox,
  Space,
} from "antd";
import { GetListOfRecords, PostData } from "./Services";
import { useSelector } from "react-redux";
import { CheckOutlined } from "@ant-design/icons";
export default function Employees(props) {
  const userDetails = useSelector((state) => state.userDetails);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [supervisor, setSupervisor] = useState(false);
  const [hr, setHr] = useState(false);
  const [sysAd, setSysAd] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showModalUsername, setShowModalUsername] = useState(false);
  const [DepartmentHead, setDepartmentHead] = useState(false);
  const [DepartmentHeadApprover, setDepartmentHeadApprover] = useState(false);
  const { Search } = Input;
  const columns = [
    {
      title: "",
      dataIndex: "operation",
      width: 75,
      render: (text, record) =>
        data.length >= 1 ? (
          <>
            <Space>
              <Button type="link" onClick={() => handleSelect(record)}>
                {<CheckOutlined />}
                Select
              </Button>
              <Button type="link" onClick={() => handleResetPassword(record)}>
                {<CheckOutlined />}
                Reset Password
              </Button>
              <Button type="link" onClick={() => handeChangeUsername(record)}>
                {<CheckOutlined />}
                Change Username
              </Button>
            </Space>
          </>
        ) : null,
    },
    {
      title: "Emp. No.",
      dataIndex: "sEmpID",
      key: "sEmpID",
    },
    {
      title: "Name",
      dataIndex: "Name",
      sorter: (a, b) => a.Name.length - b.Name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Supervisor Approve Leave",
      dataIndex: "SupervisorApproveLeaveStr",
      responsive: ["md"],
    },
    {
      title: "Hr Approve Leave",
      dataIndex: "HrApproveLeaveStr",
      responsive: ["md"],
    },
    {
      title: "SysAd",
      dataIndex: "SysAdStr",
      responsive: ["md"],
    },
  ];
  const handleGetData = async (e) => {
    try {
      const res = await GetListOfRecords({
        param1: "GetListOfEmployees",
        param2: e,
      });
      setData([]);
      if (res) {
        setData(res);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleSelect = (e) => {
    setShowModal(true);
    setSelectedRecord(e);
    setSupervisor(e.SupervisorApproveLeaveStr === "No" ? false : true);
    setHr(e.HrApproveLeaveStr === "No" ? false : true);
    setSysAd(e.SysAdStr === "No" ? false : true);
    setDepartmentHead(e.DepartmentHeadStr === "No" ? false : true);
    setDepartmentHeadApprover(
      e.DepartmentHeadApproverStr === "No" ? false : true
    );
  };
  const handleResetPassword = (e) => {
    setShowModalPassword(true);
    setSelectedRecord(e);
  };

  const handeChangeUsername = (e) => {
    setShowModalUsername(true);
    setSelectedRecord(e);
  };

  const handleOk = () => {
    setShowModal(false);
  };
  const handleOkPassword = () => {
    setShowModalPassword(false);
  };
  const handleOkUsername = () => {
    setShowModalUsername(false);
  };

  const handleSubmitFormUsername = async () => {
    if (username === "") {
      return message.error("Username is required!");
    }
    try {
      const valuestosave = {
        username: userDetails.empLastNm,
        empid: selectedRecord.sEmpID,
        newusername: username,
      };

      const payLoad = {
        endPoint: "SaveUsername",
        valuestosave: valuestosave,
      };
      let res = await PostData(payLoad);
      if (res) {
        if (res.Status === 1) {
          message.success("Successfully saved!");
          setUsername("");

          setShowModalUsername(false);
          handleGetData();
        } else {
          message.error(res.Message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitFormPassword = async () => {
    if (password === "") {
      return message.error("Password is required!");
    } else if (confirmPassword === "") {
      return message.error("Please confirm your password!");
    } else if (password !== confirmPassword) {
      return message.error("Passwords do not match!");
    }
    try {
      const valuestosave = {
        username: userDetails.empLastNm,
        empid: selectedRecord.sEmpID,
        password: password,
      };

      const payLoad = {
        endPoint: "SaveResetPassword",
        valuestosave: valuestosave,
      };
      let res = await PostData(payLoad);
      if (res) {
        if (res.Status === 1) {
          message.success("Successfully saved!");
          setPassword("");
          setConfirmPassword("");
          setShowModalPassword(false);
          handleGetData();
        } else {
          message.error(res.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitForm = async () => {
    try {
      const valuestosave = {
        username: userDetails.empLastNm,
        empid: selectedRecord.sEmpID,
        supervisor: supervisor,
        hr: hr,
        sysad: sysAd,
        departmentHead: DepartmentHead,
        departmentHeadApprover: DepartmentHeadApprover,
      };

      const payLoad = {
        endPoint: "SaveAccess",
        valuestosave: valuestosave,
      };
      let res = await PostData(payLoad);
      if (res) {
        if (res.Status === 1) {
          message.success("Successfully saved!");

          setShowModal(false);
          handleGetData();
        } else {
          message.error(res.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeSupervisor = (e) => {
    setSupervisor(e.target.checked);
  };
  const onChangeHr = (e) => {
    setHr(e.target.checked);
  };
  const onChangeSysAd = (e) => {
    setSysAd(e.target.checked);
  };
  const handleWithUserAccess = () => {
    if (userDetails.SysAd === false) {
      props.history.push({
        pathname: "/accessdenied",
        state: { modulename: "System's Administrator" },
      });
    }
  };
  useEffect(() => {
    handleWithUserAccess();
    handleGetData();
  }, []);
  return (
    <div className="p-5">
      <Row gutter={[8, 8]}>
        <Search
          placeholder="Employee name"
          onSearch={handleGetData}
          style={{ width: 300 }}
        />
      </Row>
      <Row gutter={[8, 8]} className="mt-2">
        <Col span={24}>
          <Table
            size="small"
            rowKey={(record) => record.sEmpID}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 50 }}
          />
        </Col>
      </Row>
      <Modal
        title="Set Access"
        visible={showModal}
        onCancel={handleOk}
        destroyOnClose={true}
        okText="Save"
        onOk={handleSubmitForm}
      >
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Checkbox checked={supervisor} onChange={onChangeSupervisor}>
              Approve leave (Supervisor)
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="mt-5">
          <Col span={12}>
            <Checkbox checked={hr} onChange={onChangeHr}>
              Approve leave (HR)
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="mt-5">
          <Col span={12}>
            <Checkbox checked={sysAd} onChange={onChangeSysAd}>
              System's Administrator
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="mt-5">
          <Col span={12}>
            <Checkbox
              checked={DepartmentHead}
              onChange={(e) => setDepartmentHead(e.target.checked)}
            >
              Department Head
            </Checkbox>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="mt-5">
          <Col span={12}>
            <Checkbox
              checked={DepartmentHeadApprover}
              onChange={(e) => setDepartmentHeadApprover(e.target.checked)}
            >
              Department Head Approver
            </Checkbox>
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Reset Password"
        visible={showModalPassword}
        onCancel={handleOkPassword}
        destroyOnClose={true}
        okText="Save"
        onOk={handleSubmitFormPassword}
      >
        <Row gutter={[8, 8]}>
          <Col span={6}>Password</Col>
          <Col span={6}>
            <Input.Password
              style={{ width: 300 }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Col>
        </Row>

        <Row gutter={[8, 8]} className="mt-2">
          <Col span={6}>Confirm Password</Col>
          <Col span={6}>
            <Input.Password
              style={{ width: 300 }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Change Username"
        visible={showModalUsername}
        onCancel={handleOkUsername}
        destroyOnClose={true}
        okText="Save"
        onOk={handleSubmitFormUsername}
      >
        <Row gutter={[8, 8]}>
          <Col span={6}>Username</Col>
          <Col span={6}>
            <Input
              style={{ width: 300 }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
