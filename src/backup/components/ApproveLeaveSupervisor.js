/* eslint-disable no-useless-concat */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Modal,
  Select,
  message,
  Badge,
  Affix,
  Input,
  Space,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { updateShowSpin } from "../actions";
import { useDispatch } from "react-redux";
import moment from "moment";
import { GetListOfRecords, PostData } from "./Services";
import { useSelector } from "react-redux";
import { Enumerable } from "linq";
const { Option } = Select;
export default function ApproveLeaveSupervisor(props) {
  const [mode, setMode] = useState("");
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const showSpin = useSelector((state) => state.showSpin);
  const [leaveCounts, setLeaveCounts] = useState([]);
  const [datefrom, setDateFrom] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    return moment("01/" + "01/" + y.toString(), "MM/DD/YYYY");
  });

  const [dateto, setDateTo] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    return moment("12/" + "31/" + y.toString(), "MM/DD/YYYY");
  });
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [leaveType, setLeaveType] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [year, setYear] = useState("");
  const [employees, setEmployees] = useState([]);
  const [empId, setEmpId] = useState("");
  const [department, setDepartment] = useState("");
  const [rowSelected, setRowSelected] = React.useState([]);
  const [password, setPassword] = useState("");

  const [reload, setReload] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "EmpName",
    },
    {
      title: "Date",
      dataIndex: "TransDateStr",
    },
    {
      title: "Sked Time In",
      dataIndex: "SkedTimeIn",
    },

    {
      title: "Sked Time Out",
      dataIndex: "SkedTimeOut",
    },
    {
      title: "Duty",
      dataIndex: "DutyCodeDescription",
    },
    {
      title: "Date Filed",
      dataIndex: "DateFiledStr",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
    /*     {
      title: "Approved(Supervisor)",
      dataIndex: "ApprovedSupervisor",
    },
    {
      title: "Date Approved(Supervisor)",
      dataIndex: "ApproveSupervisorDateStr",
    },
    {
      title: "Approved(HR)",
      dataIndex: "ApprovedHr",
    },
    {
      title: "Date Approved(HR)",
      dataIndex: "ApprovedHrDateStr",
    }, */
  ];

  const handleGetEmployees = async () => {
    try {
      let res = await GetListOfRecords({
        param1: "getEmployees",
        param2: userDetails.empDepCode,
      });
      if (res) {
        setEmployees(res);
      }
    } catch (error) {}
  };

  const handleGetListOfEmployees = async () => {
    try {
      let res = [];

      res = await GetListOfRecords({
        param1: "udp_GetEmployeeSchedulesSupervisor",
        param2: empId,
        param3: moment(datefrom).format("YYYYMMDD"),
        param4: moment(dateto).format("YYYYMMDD"),
        param5: leaveType,
        param6: userDetails.empDepCode,
        param7: userDetails.department_head_approver,
      });

      setData([]);

      if (res) {
        setData(res);
      }
    } catch (error) {}
  };

  const handleRefreshList = async () => {
    try {
      setYear(moment(datefrom).format("YYYY"));
      dispatch(updateShowSpin(true));
      setLeaveType("");

      handleGetListOfEmployees();

      let res = [];
      res = await GetListOfRecords({
        param1: "getDepartmentDesc",
        param2: userDetails.empDepCode,
      });
      if (res) {
        setDepartment(res[0].DESCRIPTION);
      }

      dispatch(updateShowSpin(false));

      handleGetLeaveCount();
    } catch (error) {
      dispatch(updateShowSpin(false));
      message.error(error.message);
    }
  };

  const handleGetLeaveCount = async () => {
    setYear(moment(datefrom).format("YYYY"));
    dispatch(updateShowSpin(true));
    let res = await GetListOfRecords({
      param1: "GetLeaveCountSupervisor",
      param2: moment(datefrom).format("YYYY"),
      param3: userDetails.empDepCode,
      param4: props.location.state.mode,
    });
    setLeaves([]);

    if (res) {
      dispatch(updateShowSpin(false));
      setLeaves(res);
    }
  };
  const handleOk = () => {
    setShowModal(false);
  };
  const handleSubmitForm = async () => {
    if (password === "") {
      return message.error("Password is required!");
    }

    try {
      const valuestosave = {
        username: userDetails.empLastNm,
        password: password,
        dates: rowSelected,
        mode: "supervisor",
        sempid: userDetails.username,
        mode2: mode,
      };
      console.log(valuestosave);
      const payLoad = {
        endPoint: "ApproveLeave",
        valuestosave: valuestosave,
      };
      let res = await PostData(payLoad);
      if (res) {
        if (res.Status === 1) {
          message.success("Successfully saved!");
          setRowSelected([]);
          setShowModal(false);
          handleRefreshList();
        } else {
          message.error(res.Message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFilter = async (e) => {
    setLeaveType(e);
    setReload(uuidv4());
  };
  const handleRowSelection = {
    selectedRowKeys: rowSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.isLeaveFiled === false || record.ApprovedSupervisor !== "",
      // Column configuration not to be checked
      name: record.Id,
    }),
  };
  const handleFileLeave = (x) => {
    setMode(x);
    setPassword("");
    setShowModal(true);
  };
  useEffect(() => {
    if (userDetails.changepassword === true) {
      props.history.push("/changepassword");
    }
    handleGetEmployees();
    handleGetLeaveCount();
    handleRefreshList();
  }, []);
  useEffect(() => {
    handleGetListOfEmployees();
  }, [reload]);
  return (
    <div className="p-5">
      <Row gutter={[8, 8]} className="mb-3">
        <Col>
          <div className="text-xl font-bold">
            {props.location.state.mode === "supervisor"
              ? "Leave approval(Supervisor)-" + `${department}`
              : "Leave approval(HR)"}
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col>Date From</Col>
        <Col>
          <DatePicker
            placeholder="Date From"
            style={{ width: "150px" }}
            value={datefrom}
            format={"MM/DD/yyyy"}
            onChange={(value, dateString) => {
              setDateFrom(value);
            }}
          />
        </Col>
        <Col>Date To</Col>
        <Col>
          <DatePicker
            placeholder="Date To"
            style={{ width: "150px" }}
            value={dateto}
            format={"MM/DD/yyyy"}
            onChange={(value, dateString) => {
              setDateTo(value);
            }}
          />
        </Col>
        <Col>Employee</Col>
        <Col>
          {employees.length > 0 && (
            <Select
              disabled={userDetails.department_head_approver === true}
              value={empId}
              onChange={(e) => {
                setEmpId(e);
                setLeaveType("");
              }}
              style={{ width: 300 }}
              allowClear
              onClear={(e) => {
                setEmpId("");
                setLeaveType("");
              }}
            >
              {employees.map((d) => (
                <Option key={d.sempid}>{d.empname}</Option>
              ))}
            </Select>
          )}
        </Col>
        <Col>
          <Button
            loading={showSpin}
            onClick={() => setReload(uuidv4())}
            type="primary"
          >
            Refresh list
          </Button>
        </Col>
      </Row>
      <Row className="mt-5" gutter={[8, 8]}>
        <div className="font-semibold">
          Pending leaves for approval for the year:{year}
        </div>
      </Row>
      <Row className="mt-5" gutter={[16, 16]}>
        {leaves.map((i) => (
          <>
            <Col className="font-semibold">
              <Badge count={i.Countx}>
                <Button
                  type="primary"
                  onClick={() => handleFilter(i.DUTY_CODE)}
                  loading={showSpin}
                >
                  {i.DESCRIPTION}
                </Button>
              </Badge>
            </Col>
            {/* <Col className="font-semibold text-xl">{i.Countx}</Col> */}
          </>
        ))}
      </Row>
      <Row className="mt-3">
        <Col>
          <Affix offsetTop={70}>
            <Space>
              <Button
                type="primary"
                disabled={rowSelected.length <= 0}
                icon={<CheckOutlined />}
                onClick={() => handleFileLeave("approve")}
              >
                Approve Leave
              </Button>

              <Button
                type="primary"
                disabled={rowSelected.length <= 0}
                onClick={() => handleFileLeave("disapprove")}
                icon={<CloseOutlined />}
              >
                Disapprove Leave
              </Button>
            </Space>
          </Affix>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col span={24}>
          <Table
            size="small"
            rowKey={(record) => record.Id}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 50 }}
            rowSelection={handleRowSelection}
          />
        </Col>
      </Row>
      <Modal
        title={mode === "approve" ? "Approve Leave" : "Disapprove Leave"}
        visible={showModal}
        onCancel={handleOk}
        //  destroyOnClose={true}
        okText={mode === "approve" ? "Approve Leave" : "Disapprove Leave"}
        // onOk={handleSubmitForm}
        footer={null}
      >
        <Row gutter={[8, 8]} className="mt-3">
          <Col span={6}>Password</Col>
          <Col>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: 300 }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={6}></Col>
          <Col>
            <Space className="mt-2">
              <Button onClick={handleOk} type="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmitForm} type="primary">
                Save
              </Button>
            </Space>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
