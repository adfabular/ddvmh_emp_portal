import React from "react";
import { Row, Col, Input, Form, message, Button } from "antd";
import { useSelector } from "react-redux";
import { PostData } from "./Services";
import { useDispatch } from "react-redux";
import { updateUser } from "../actions";
export default function ChangePassword(props) {
  const [form] = Form.useForm();
  const userDetails = useSelector((state) => state.userDetails);
  const dispatch = useDispatch();
  const handleSubmitForm = async (values) => {
    const valuestosave = {
      ...values,
      username: userDetails.empLastNm,
      empid: userDetails.username,
    };
    console.log(valuestosave);
    const payLoad = {
      endPoint: "SaveChangePassword",
      valuestosave: valuestosave,
    };

    try {
      let res = await PostData(payLoad);
      if (res) {
        console.log(res);
        if (res.Status === 1) {
          message.success("Successfully saved!");
          dispatch(updateUser({}));
          localStorage.removeItem("tokenid");
          props.history.push("/login");
        } else {
          message.error(res.Message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-5">
      <Row gutter={[8, 8]}>
        <Col sm={24} xs={24} md={8}></Col>
        <Col sm={24} xs={24} md={8}>
          <div className="text-lg text-center font-bold">Change Password</div>
          <div className="shadow-lg p-4">
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmitForm}
              scrollToFirstError
              destroyOnClose={true}
            >
              <Form.Item
                label="Old Password"
                name="OldPassword"
                rules={[
                  { max: 50 },
                  { min: 3 },
                  {
                    required: true,
                    message: "Old Password is required!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="NewPassword"
                rules={[
                  { max: 50 },
                  { min: 3 },
                  {
                    required: true,
                    message: "New password is required!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="ConfirmNewPassword"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("NewPassword") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        "The two passwords that you entered do not match!"
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}
