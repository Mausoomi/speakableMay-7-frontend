

import React, { useEffect, useState } from "react";
import AdminNav from "../admin-dashboard-components/AdminNav";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackage } from "../../store/actions/packagesActions";
import { Create_Payment } from "../../store/actions/paymentActions";

const CheckDetails = () => {
  const { Package_ID } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // Initialize with 0
  const [companyName, setCompanyName] = useState("");
  const [nip, setNip] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");

  const user = useSelector((state) => state.students.user);
  const pack = useSelector((state) => state.packages.currentPackage);

  console.log(pack);

  const location = useLocation();
  const totalCount = location.state;

  const calculateTotalAmount = async () => {
    let total_Amount = 0;
    if (pack && pack.Course_IDs && pack.Course_IDs.length > 0) {
      await Promise.all(
        pack.Course_IDs.map(async (course) => {
          if (!isNaN(course.Purchase_Price)) {
            // Check if Purchase_Price is not NaN
            total_Amount += course.Purchase_Price;
          }
        })
      );
    }
    total_Amount *= totalCount; // Multiply by totalCount
    setTotalAmount(total_Amount);
  };

  const paymentResponseUrl = useSelector(
    (state) => state.payments.paymentResponseUrl
  );

  const PackageName = pack?.Package_Name;
  const Desciption = pack?.Package_Name;
  const Email = user?.Email;
  const Phone = user?.Phone_Number;
  const StudentName = user?.Username;

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        await dispatch(fetchPackage(Package_ID));
        await calculateTotalAmount();
      } catch (error) {
        console.error("Error fetching package:", error.message);
      }
    };
    fetchPackageData();
  }, [Package_ID, dispatch]);

  useEffect(() => {
    if (paymentResponseUrl.length > 0) {
      setLoading(false);
      window.location.href = paymentResponseUrl;
    }
  }, [paymentResponseUrl]);

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      await dispatch(
        Create_Payment({
          Package_ID,
          Desciption:PackageName,
          totalAmount,
          Email,
          Phone,
          StudentName,
          // Street:street,
          // zipCode:zipCode,
          // city:city
        })
      );
    } catch (error) {
      console.error("Payment failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNav />
      <form className="Student_mainPage_style" onSubmit={submitHandler}>
        <h2>Order Details</h2>
        <div className="d-flex flex-wrap confirm-Box">
          <div className="PersonalInfo">
            <h5>User Info</h5>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Username
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={StudentName}
                required
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Name of Company
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  NIP
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Street
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Zip-Code
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  City
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Number Phone
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={Phone}
                required
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Email
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Email"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={Email}
              />
            </div>
          </div>
          <div className="OrderInfo">
            <h5>Your Order</h5>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Package Name
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Email"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={PackageName}
                disabled
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  Amount Payable
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Email"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={totalAmount}
                disabled
              />
            </div>
          </div>
        </div>

        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customCheck1"
            required
          />
          <label class="custom-control-label" for="customCheck1">
            I Read and accept Rules
          </label>
        </div>
        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customCheck1"
            required
          />
          <label class="custom-control-label" for="customCheck1">
            I read and confirm you agree to our privacy policy.
          </label>
        </div>

        <button
          type="submit"
          className={`btn btn-outline-success ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>
      </form>
    </>
  );
};

export default CheckDetails;
