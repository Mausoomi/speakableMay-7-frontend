import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Booknow.css";
import { getOrderDetails } from "../../store/actions/paymentActions";
import { useReactToPrint } from "react-to-print"; // Assuming you're using 'react-to-print'
import { useNavigate } from "react-router-dom";

const Booknow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderData = useSelector((state) => state.payments.orderData);
  // console.log(orderData);
  const componentRef = useRef();

  useEffect(() => {
    // Function to get cookie value by name
    const getCookie = (name) => {
      const cookieString = document.cookie;
      const cookies = cookieString.split("; ");

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName.trim() === name) {
          return decodeURIComponent(cookieValue);
        }
      }

      return null;
    };

    const orderId = getCookie("orderId");
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch]); // Only dispatch when dispatch function changes

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const generatePDF = () => {
    handlePrint();
    // Add logic to generate PDF here
  };

  const HomeNavigator = () => {
    navigate("/Student-dashboard/dash");
  };

  return (
    <div className="Booknow_main_div bg-light d-flex flex-column justify-content-center align-items-center  ">
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        ref={componentRef}
      >
        {orderData && (
          <>
            {orderData?.properties?.map((val, index) => (
              <div key={index}>
                {val.name} - {val.value}
              </div>
            ))}
          </>
        )}
        {orderData && (
          <>
            {orderData?.orders?.map((val, index) => (
              <div className="text-center mt-3" key={index}>
                {val.status === "COMPLETED" ? (
                  <div className="text-success fs-5">{val.status}</div>
                ) : (
                  <div className="text-danger">{val.status}</div>
                )}
                <div>OrderId - {val.orderId}</div>
                <div>merchantPosId - {val.merchantPosId}</div>
                <div>totalAmount - {val.totalAmount}</div>
                <div>currencyCode - {val.currencyCode}</div>
                <div className="mt-3">
                  <span className="fs-5 ">Products Information</span> <br />
                  Product ID - {""}
                  {val.products?.map((product, index) => {
                    return <>{product.name}</>;
                  })}
                  <br />
                  Product Price - {""}
                  {val.products?.map((product, index) => {
                    return <>{product.unitPrice}</>;
                  })}
                </div>
              </div>
            ))}
            <div>{orderData?.status?.statusDesc}</div>
          </>
        )}
      </div>
      <div>
        <button className="btn btn-outline-primary mt-3" onClick={generatePDF}>
          Download Reciept
        </button>
        <button
          className="btn btn-outline-primary mt-3 mx-3"
          onClick={HomeNavigator}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Booknow;
