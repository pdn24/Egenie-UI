import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useNavigate, useParams } from "react-router-dom";

const AcceptConnection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const storeId = queryParams?.get("store_id") || null;
  const storeName = queryParams?.get("store_name") || null;
  const userId = queryParams?.get("user_id") || null;
  const token = queryParams?.get("token") || null;

  function submitButton() {
    if (storeId && storeName) {
      navigate("/connectstore2");
    } else if (userId && token) {
      navigate(`/user/reset_password/${token}`);
    }
  }

  return (
    <div>
        <div className="flex flex-col justify-center items-center flex-wrap gap-5  h-screen">
          <div className="flex justify-center items-center  gap-2 ">
            {storeId != null ? (
              <p
                style={{
                  fontWeight: "500",
                  textShadow: "1px 1px #3c3c3c",
                  fontSize: "20px",
                }}
              >
                You are connected to store id {storeId} and {storeName}
              </p>
            ) : null}
            {token != null ? (
              <p
                style={{
                  fontWeight: "500",
                  textShadow: "1px 1px #3c3c3c",
                  fontSize: "20px",
                  textAlign: "center",
                }}
              >
                You will Redirect To Reset Your password <br /> Click OK To
                Proceed
              </p>
            ) : null}
          </div>
          {storeId != null && storeName != null ? (
            <div className="w-[150px]">
              <button
                className="w-[300px] w-full sm:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black ease-in-out duration-700"
                onClick={() => {
                  submitButton();
                }}
              >
                Submit
              </button>
            </div>
          ) : (
            <></>
          )}
          {token != null ? (
            <div className="w-[150px]">
              <button
                className="w-[300px] w-full sm:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black ease-in-out duration-700"
                onClick={() => {
                  submitButton();
                }}
              >
                Ok
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
    </div>
  );
};

export default AcceptConnection;
