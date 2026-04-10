/* eslint-disable no-useless-concat */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, message } from "react";
import { Row, Col, DatePicker, Button, Table } from "antd";
import moment from "moment";
import { GetListOfRecords } from "./Services";
import { useSelector } from "react-redux";
import { CheckOutlined } from "@ant-design/icons";
export default function Schedule(props) {
  const userDetails = useSelector((state) => state.userDetails);
  const [datefrom, setDateFrom] = useState(moment(new Date(), "MM/dd/yyyy"));
  const [dateto, setDateTo] = useState(moment(new Date(), "MM/dd/yyyy"));
  const [data, setData] = useState([]);
  const lastday = (y, m) => {
    return new Date(y, m, 0).getDate();
  };

  const columns = [
    {
      title: "",
      dataIndex: "operation",
      width: 75,
      render: (text, record) =>
        data.length >= 1 ? (
          <>
            {record.isLeaveFiled === false && (
              <Button type="link" onClick={() => handleSelect(record)}>
                {<CheckOutlined />}
                Select
              </Button>
            )}
          </>
        ) : null,
    },
    {
      title: "Date",
      dataIndex: "TransDateStr",
    },
    {
      title: "Sked Time In",
      dataIndex: "TIME_IN",
    },

    {
      title: "Sked Time Out",
      dataIndex: "TIME_OUT",
    },
    {
      title: "Duty",
      dataIndex: "DutyCodeStr",
    },
  ];

  const handleSelect = (record) => {
    console.log(record);
  };
  const handleInitializeDates = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const lastDay = lastday(y, m);
    const datefrom = m.toString() + "/" + "01/" + y.toString();
    const dateto = m.toString() + "/" + lastDay.toString() + "/" + y.toString();

    setDateFrom(moment(datefrom, "MM/DD/YYYY"));
    setDateTo(moment(dateto, "MM/DD/YYYY"));
  };
  const handleRefreshList = async () => {
    console.log(moment(datefrom).format("YYYYMMDD"));

    try {
      const res = await GetListOfRecords({
        param1: "GetSchedule",
        param2: userDetails.sEmpID,
        param3: moment(datefrom).format("YYYYMMDD"),
        param4: moment(dateto).format("YYYYMMDD"),
      });
      setData([]);
      if (res) {
        setData(res);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    handleInitializeDates();
  }, []);
  return (
    <div>
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
      <Row className="mt-5">
        <Col span={24}>
          <Table
            size="small"
            rowKey={(record) => record.Id}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 50 }}
          />
        </Col>
      </Row>
    </div>
  );
}
