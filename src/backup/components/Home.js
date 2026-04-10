import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "./styles/home.css";
export default function Home(props) {
  const userDetails = useSelector((state) => state.userDetails);
  useEffect(() => {
    if (userDetails.changepassword === true) {
      props.history.push("/changepassword");
    }
  });
  return <div className="container"></div>;
}
