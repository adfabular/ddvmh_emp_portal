import axios from "axios";
// const apiUrl = "http://hrpayroll:8081/api/";
const apiUrl = "http://122.54.113.225:8000/employeeportalapi/api/";

//const apiUrl = "http://122.54.113.225:8000/employeeportalapi/api/";
//http://localhost:57715/api/
//http://sparepc/employeeportalapi
//http://122.54.113.225:8000/employeeportalapi/api/
//http://ddvmh:8000/employeeportalapi
export async function PostData(payLoad) {
  console.log(payLoad);
  try {
    var token = localStorage.getItem("tokenid");
    axios.defaults.baseURL = apiUrl + payLoad.endPoint;
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    let res = await axios.post(apiUrl + payLoad.endPoint, payLoad.valuestosave);

    if (res) {
      return res.data;
    }
  } catch (error) {
    return { Status: 0, Message: error.response.data.Message };
  }
}

export async function GetListOfRecords(payLoad) {
  const url = apiUrl + "GetListOfRecords";
  var token = localStorage.getItem("tokenid");
  axios.defaults.baseURL = url;
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

  try {
    const response = await axios.get(url, {
      params: {
        param1: payLoad.param1,
        param2: payLoad.param2,
        param3: payLoad.param3,
        param4: payLoad.param4,
        param5: payLoad.param5,
        param6: payLoad.param6,
        param7: payLoad.param7,
      },
    });

    if (response) {
      return response.data;
    }
  } catch (error) {
    return { Status: 0, Message: error.response.data.Message };
  }
}
