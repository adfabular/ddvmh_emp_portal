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
import { updateShowSpin } from "../actions";
import { useDispatch } from "react-redux";
import moment from "moment";
import { GetListOfRecords, PostData } from "./Services";
import { useSelector } from "react-redux";

const { Option } = Select;
export default function Leaves(props) {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
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
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveType, setLeaveType] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [year, setYear] = useState("");
  const [rowSelected, setRowSelected] = React.useState([]);
  const [password, setPassword] = useState("");
  const [remarks, setRemarks] = useState("");
  const [enableSave, setEnableSave] = useState(false);
  const rankAndFileLeaves = [
    {
      leaveCode: "BER",
      countx: 3,
    },
    {
      leaveCode: "EL",
      countx: 3,
    },
    {
      leaveCode: "MAL",
      countx: 5,
    },

    {
      leaveCode: "PT",
      countx: 7,
    },
    {
      leaveCode: "SL",
      countx: 12,
    },
    {
      leaveCode: "SOL",
      countx: 7,
    },
    {
      leaveCode: "VL",
      countx: 12,
    },
  ];

  const managementLeaves = [
    {
      leaveCode: "BER",
      countx: 3,
    },
    {
      leaveCode: "EL",
      countx: 3,
    },
    {
      leaveCode: "MAL",
      countx: 5,
    },

    {
      leaveCode: "PT",
      countx: 7,
    },
    {
      leaveCode: "SL",
      countx: 18,
    },
    {
      leaveCode: "SOL",
      countx: 7,
    },
    {
      leaveCode: "VL",
      countx: 18,
    },
  ];
  const columns = [
    /* {
      title: "",
      dataIndex: "operation",
      width: 75,
      render: (text, record) =>
        data.length >= 1 ? (
          <>
            {record.isLeaveFiled === false && (
              <Button type="link" onClick={() => handleSelect(record)}>
                {<CheckOutlined />}
                File a leave
              </Button>
            )}
          </>
        ) : null,
    }, */
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
    },
  ];

  const handleGetData = async () => {
    try {
      let res = await GetListOfRecords({
        param1: "GetLeaveTypes",
      });

      if (res) {
        setLeaveTypes(res);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  const handleRefreshList = async () => {
    try {
      dispatch(updateShowSpin(true));
      setYear(moment(datefrom).format("YYYY"));
      let res = await GetListOfRecords({
        param1: "udp_GetEmployeeSchedule",
        param2: userDetails.sEmpID,
        param3: moment(datefrom).format("YYYYMMDD"),
        param4: moment(dateto).format("YYYYMMDD"),
        param5: "",
      });
      setData([]);
      setRowSelected([]);
      if (res) {
        setData(res);
        dispatch(updateShowSpin(false));
      }
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
      param1: "GetLeaveCount",
      param2: userDetails.sEmpID,
      param3: moment(datefrom).format("YYYY"),
    });
    setLeaves([]);

    if (res) {
      setLeaves(res);
      dispatch(updateShowSpin(false));
    }
  };
  const handleOk = () => {
    setShowModal(false);
  };
  const handleSubmitForm = async () => {
    if (enableSave === false) {
      return message.error("You have already consume your leave!");
    }

    if (leaveType === "") {
      return message.error("Please select leave type!");
    } else if (password === "") {
      return message.error("Password is required!");
    } else if (remarks === "") {
      return message.error("Remarks is required!");
    }

    try {
      const valuestosave = {
        username: userDetails.empLastNm,
        leaveType: leaveType,
        dates: rowSelected,
        sempid: userDetails.username,
        password: password,
        remarks: remarks,
      };

      const payLoad = {
        endPoint: "SaveLeave",
        valuestosave: valuestosave,
      };
      let res = await PostData(payLoad);
      if (res) {
        if (res.Status === 1) {
          message.success("Successfully saved!");

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
    const datefrom = "01/01/" + year.toString();
    const dateto = "12/31/" + year.toString();

    setDateFrom(moment(datefrom, "MM/DD/YYYY"));
    setDateTo(moment(dateto, "MM/DD/YYYY"));
    dispatch(updateShowSpin(true));
    try {
      let res = await GetListOfRecords({
        param1: "udp_GetEmployeeSchedule",
        param2: userDetails.sEmpID,
        param3: moment(datefrom).format("YYYYMMDD"),
        param4: moment(dateto).format("YYYYMMDD"),
        param5: e,
      });
      setData([]);

      if (res) {
        setData(res);
        dispatch(updateShowSpin(false));
      }
    } catch (error) {
      dispatch(updateShowSpin(false));
      message.error(error.message);
    }
  };
  const handleRowSelection = {
    selectedRowKeys: rowSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.isAllowed === false,
      // Column configuration not to be checked
      name: record.ID,
    }),
  };
  const handleFileLeave = () => {
    setLeaveType("");
    setPassword("");
    setRemarks("");
    setShowModal(true);
  };
  const handleSetLeave = (e) => {
    console.log(e);
    setLeaveType(e);
    const countx = rowSelected.length;
    const countLeave = leaves.filter((f) => f.DUTY_CODE === e);

    let allowedLeave = 0;
    if (userDetails.EmployeeClass === "RANK AND FILE") {
      const xx = rankAndFileLeaves.filter((f) => f.leaveCode === e);
      console.log(xx);
      allowedLeave = xx[0].countx;
    } else {
      const xx = managementLeaves.filter((f) => f.leaveCode === e);
      allowedLeave = xx[0].countx;
    }

    let filedLeave = 0;

    if (countLeave.length > 0) {
      filedLeave = countLeave[0].Countx;
    }

    if (countx + filedLeave <= allowedLeave) {
      setEnableSave(true);
    } else {
      setEnableSave(false);
    }
  };
  useEffect(() => {
    if (userDetails.changepassword === true) {
      props.history.push("/changepassword");
    }
    handleGetData();
    handleGetLeaveCount();
  }, []);
  return (
    <div className="p-5">
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
        <Col>
          <Button onClick={handleRefreshList} type="primary">
            Refresh list
          </Button>
        </Col>
      </Row>
      <Row className="mt-5" gutter={[8, 8]}>
        <div className="font-semibold">Filed Leaves for the year:{year}</div>
      </Row>
      <Row className="mt-5" gutter={[16, 16]}>
        {leaves.map((i) => (
          <>
            <Col className="font-semibold">
              <Badge count={i.Countx}>
                <Button
                  type="primary"
                  onClick={() => handleFilter(i.DUTY_CODE)}
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
            <Button
              type="primary"
              disabled={rowSelected.length <= 0}
              onClick={handleFileLeave}
            >
              File Leave
            </Button>
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
        title="File Leave"
        visible={showModal}
        onCancel={handleOk}
        //  destroyOnClose={true}
        okText="Save"
        onOk={handleSubmitForm}
        footer={null}
      >
        <Row gutter={[8, 8]} className="mt-3">
          <Col span={6}>Leave Type</Col>
          <Col>
            <Select
              value={leaveType}
              onChange={(e) => handleSetLeave(e)}
              style={{ width: 300 }}
            >
              {leaveTypes.map((d) => (
                <Option key={d.CODE}>{d.DESCRIPTION}</Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="mt-3">
          <Col span={6}>Remarks</Col>
          <Col>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={{ width: 300 }}
            />
          </Col>
        </Row>

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
