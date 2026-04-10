import React, { useState } from "react";
import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
export default function AccessDenied(props) {
  //"Sorry, you are not authorized to access the module "
  const [message] = useState(
    "Sorry, you are not authorized to access the module " +
      props.location.state.modulename
  );
  return (
    <div>
      <Result
        status="403"
        title={message}
        extra={
          <Button type="primary" onClick={() => props.history.replace("/")}>
            <HomeOutlined /> Back Home
          </Button>
        }
      />
    </div>
  );
}
