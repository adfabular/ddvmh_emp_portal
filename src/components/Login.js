import React, { useState } from "react";
import { Row, Col, message, Button, Form, Input } from "antd";
import { PostData } from "./Services";
import { updateUser } from "../actions";
import { useDispatch } from "react-redux";
export default function Login(props) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmitForm = async (values) => {
    const payLoad = {
      endPoint: "Login",
      valuestosave: values,
    };
    try {
      setIsSubmitting(true);
      let res = await PostData(payLoad);

      if (res) {
        if (res.stat.Status === 1) {
          message.success("User credentials successfully validated!");
          localStorage.removeItem("tokenid");
          localStorage.setItem("tokenid", res.userDetails.tokenid);
          dispatch(updateUser(res.userDetails));
          setIsSubmitting(false);
          props.history.push({
            pathname: "/",
            state: {},
          });
        } else {
          setIsSubmitting(false);
          message.error(res.stat.Message);
        }
      }
    } catch (error) {
      setIsSubmitting(true);
      message.error(error);
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 17,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 19,
        offset: 7,
      },
    },
  };

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col sm={24} md={6}></Col>
        <Col sm={24} xs={24} md={24} lg={12}>
          <div className="col-span-3 border shadow-lg p-2 bg-gray-100">
            <div className="text-center font-bold text-md">Login</div>
            <div>
              <Form
                {...formItemLayout}
                form={form}
                onFinish={handleSubmitForm}
                scrollToFirstError
              >
                <Form.Item
                  label="Username"
                  name="EmpNo"
                  rules={[
                    {
                      required: true,
                      message: "Username is required!",
                    },
                    {
                      max: 50,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="Password"
                  rules={[
                    {
                      max: 50,
                    },
                    {
                      required: true,
                      message: "Password is required!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
