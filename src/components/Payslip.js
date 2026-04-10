/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Row, Col, Table, Button } from "antd";
import { GetListOfRecords } from "./Services";
import { useSelector } from "react-redux";
import axios from "axios";
export default function Payslip(props) {
  const userDetails = useSelector((state) => state.userDetails);
  const [data, setData] = useState([]);
  const [newBlob, setNewBlob] = useState(null);
  const columns = [
    {
      title: "Payroll Period",
      dataIndex: "PayrollPeriod",
    },
    {
      title: "Date Covered",
      dataIndex: "DateCovered",
    },
    {
      title: "",
      dataIndex: "operation",

      render: (text, record) =>
        data.length >= 1 ? (
          <Button type="link" onClick={() => handlePreview(record)}>
            Preview
          </Button>
        ) : null,
    },
  ];
  const handleGetPayslips = async () => {
    const res = await GetListOfRecords({
      param1: "GetPayslips",
      param2: userDetails.empNo,
    });
    if (res) {
      setData(res);
    }
  };
  const handlePreview = async (record) => {
    //"http://122.54.113.225:8000/employeeportalapi/api/";
    //"http://localhost:57715/api/";

    // const apiUrl = "http://localhost:57715/api/";
    const apiUrl = "http://122.54.113.225:8000/employeeportalapi/api/";
    try {
      await axios({
        url: apiUrl + "downloadreport", //your url
        method: "GET",
        responseType: "blob", // important
        params: {
          reportName: "payslip.rpt",
          param1: record.PayrollID,
          param2: record.PayrollPeriod,
        },
      }).then((response) => {
        let newBlob;
        newBlob = new Blob([response.data], {
          type: "application/pdf",
        });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        const data = window.URL.createObjectURL(newBlob);
        setNewBlob(data);
      });
    } catch (error) {}
  };
  useEffect(() => {
    if (userDetails.changepassword === true) {
      props.history.push("/changepassword");
    }
    handleGetPayslips();
  }, []);

  return (
    <div className="p-5">
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24} md={5}>
          <Table
            size="small"
            rowKey={(record) => record.Id}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 50 }}
          />
        </Col>
        <Col xs={24} sm={24} md={19}>
          <iframe
            title="xxx"
            src={newBlob}
            style={{ width: "100%", height: "700px" }}
          ></iframe>
        </Col>
      </Row>
    </div>
  );
}
