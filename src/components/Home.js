import React, { useEffect, useState, handleClick } from "react";
import "../assets/css/Home.css";
import Header from "./Header";
import truIcon from "../assets/icons/trueIcon.svg";
import closeRedIcon from "../assets/icons/closeRedIcon.svg";
import sendIcon from "../assets/icons/sendIcon.svg";
import noiseMain from "../assets/image/noiseMain.png";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import email from "../assets/image/Letter.svg";
import usericon from "../assets/image/User.svg";
import password from "../assets/image/LockPassword.svg";
import { Modal } from "flowbite-react";
import { Cookies } from "react-cookie";
import { Link } from "react-router-dom";
import { showAlert } from "./utils/AlertService";

const Home = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchSubscriptionPlan = async (e) => {
    try {
      const response = await axios.get(
        `${apiUrl}/subscriptions/get_subscription_plans`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSubscriptionPlans(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSubscriptionPlan();
  }, []);

  useEffect(() => {
    const token = cookies.get("login_token");
    if (token) {
      navigate("/home2");
    }
  }, []);

  const handleClose = (e) => {
    setOpenModal(false);
    setErrors({
      name: "",
      email: "",
      password: "",
    });
    setUser({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  function buyPlan(e, price) {
    e.preventDefault();
    const now = new Date();
    cookies.set("buy_plan_price", price, { 
      expires: new Date(now.getTime() + 15 * 60 * 1000),
    });
    setOpenModal(true);
  }

  function registerSubmit(e) {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = { ...errors };
    if (!user.name) {
      newErrors.name = "Name is required.";
      formIsValid = false;
    } else {
      newErrors.name = "";
    }
    if (!user.email) {
      newErrors.email = "Email is required.";
      formIsValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
      formIsValid = false;
    } else {
      newErrors.email = "";
    }
    if (!user.password) {
      newErrors.password = "Password is required.";
      formIsValid = false;
    } else if (
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(
        user.password
      )
    ) {
      newErrors.password =
        "Your password is too weak. Please use a combination of uppercase, lowercase, numbers, and special characters";
      formIsValid = false;
    } else {
      newErrors.password = "";
    }

    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    setOpenModal(false);
    displayRazorpay(user?.name, user?.email, user?.password);
  }

  async function displayRazorpay(name, email, password) {
    const amount = cookies.get("buy_plan_price");

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: amount,
      currency: "INR",
      name: "Egenie",
      description: "",
      order_id: "order_OaTIezLhmRYAwB",
      handler: async function (response) {
        try {
          cookies.remove("buy_plan_price");

          try {
            await axios.post(`${apiUrl}/auth`, user, {
              headers: { "Content-Type": "application/json" },
            });
            setUser({ name: "", email: "", password: "" });
            navigate("/login");
          } catch (error) {

          }
        } catch (err) {}
      },
      prefill: {
        name: name,
        email: email,
      },
      notes: { address: "" },
      theme: { color: "#61dafb" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      <section className="h-auto lg:h-screen flex flex-col bg-[#010101] bgVector">
        <Header />
        <div className="md:px-24 px-5 my-5 lg:my-0 sm:px-12 flex justify-between items-center h-full flex-col lg:flex-row gap-5">
          <div className="flex flex-col gap-6  xl:gap-14 2xl:-mt-24 items-center lg:items-start">
            <div className="flex justify-center md:justify-start">
              <h2 className="text-white 2xl:text-[96px] xl:text-6xl md:text-5xl text-3xl sm:text-5xl text-center sm:text-start xl:w-[620px] md:w-[432px] 2xl:w-[849px] sm:w-[450px] w-[290px] author font-semibold mainHeadingSize">
                Effortless{" "}
                <span className="mainHeadingSvg inline-block">bulk edits</span>{" "}
                with AI Precision
              </h2>
            </div>
            <p className="text-white opacity-50 font-thin 2xl:w-[600px] xl-w-[400px] md:w-[400px] w-full text-center md:text-start helvetica">
            Transform your Shopify store with Egenie, the ultimate tool for bulk editing product descriptions. Our AI-powered solution ensures polished, consistent, and error-free descriptions with just one click. Say goodbye to manual edits and hello to more time for growing your business. Perfect for busy entrepreneurs, especially in dropshipping, Egenie offers an affordable, efficient, and user-friendly experience.
            </p>
            <div className="flex text-white gap-2 justify-center md:justify-start">
              <div className="gradiantVecorBg">
                <Link to="/register">
                  <button className="unionBtn rounded-full w-[158px] h-[50px] text-lg btnBgBlack helvetica">
                    {" "}
                    Try it for free{" "}
                  </button>
                </Link>
              </div>
              <div className="gradiantVecorBg">
                <button className="w-[50px] h-[50px] rounded-full unionSendBtn flex justify-center btnBgBlack items-center">
                  <img src={sendIcon} width="16px" alt="icons" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center 2xl:-mt-24">
            <img
              src={noiseMain}
              className="rounded-3xl noiseMainImg w-[400px] lg:w-[500px]  xl:w-[550px]"
              alt="noise main"
            />
          </div>
        </div>
      </section>
      <section className="xl:my-14 py-4 2xl:mx-20 xl:mx-8 mx-5 helvetica">
        <h2 className="text-center font-bold text-[32px] sm:text-[35px] 2xl:text-[64px] 2xl:pt-4 pt-0">
          Pricing Plan
        </h2>
        <div className="flex justify-center">
          <div className="pricingCardWrap gap-3 xl:gap-5 xl:mt-10 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.length > 0 &&
              subscriptionPlans.map((plan, i) => (
                <div className="flex justify-center max-w-[400px]" key={i}>
                  <div className="border-2 xl:py-9 py-5 2xl:px-8 px-5 rounded-xl cardHover transition duration-1000 ease-in-out">
                    {plan.popular && (
                      <div className="flex justify-center relative">
                        <p className="bgLightGreen xl:-top-9 -top-5 xl:h-[39px] h-[30px] xl:w-[135px] w-[120px] flex justify-center items-center rounded-b-md absolute">
                          <span className="md:text-xl text-base text-white md:font-semibold font-medium">
                            Popular
                          </span>
                        </p>
                      </div>
                    )}
                    <div className="relative h-full">
                      <div className="flex justify-between p-2 pricingCardBorder">
                        <h3 className="text-[32px] xl:text-[34px] fontSemibold">
                          {plan.name}
                        </h3>
                        <h2 className="font-bold text-[32px] xl:text-[34px]">
                          ${plan.price}
                        </h2>
                      </div>
                      <div className="flex flex-col xl:gap-7 pricing-plan-gap gap-4 md:py-8 py-5">
                        <div className="flex items-center gap-2">
                          <img
                            src={truIcon}
                            className="w-5 md:w-6"
                            alt="tru icon"
                          />
                          <p className="xl:text-2xl fs-34 text-lg">
                            No. of {plan.num_stores} stores
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={truIcon}
                            className="w-5 md:w-6"
                            alt="tru icon"
                          />
                          <p className="xl:text-2xl fs-34 text-lg leading-5">
                            {plan.num_product_updates_per_month} product updates
                            per month
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={truIcon}
                            className="w-5 md:w-6"
                            alt="tru icon"
                          />
                          <p className="xl:text-2xl fs-34 text-lg">
                            {plan.num_templates} Templates
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={`${
                              plan.backup_original_data ? truIcon : closeRedIcon
                            }`}
                            className="w-5 md:w-6"
                            alt="tru icon"
                          />
                          <p className="xl:text-2xl fs-34 text-lg leading-5">
                            Backup of original data
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={`${
                              plan.compare_original_modified_data
                                ? truIcon
                                : closeRedIcon
                            }`}
                            className="w-5 md:w-6"
                            alt="tru icon"
                          />
                          <p className="xl:text-2xl fs-34 text-lg leading-5">
                            Comparison of original and modified data
                          </p>
                        </div>
                      </div>
                      <div
                        className="h-[50px]"
                        onClick={(e) => {
                          buyPlan(e, plan?.price);
                        }}
                      >
                        <button className="bg-black absolute bottom-0 w-full h-[50px] rounded-full text-white text-lg cardBtnHover transition duration-1000 ease-in-out">
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      <Modal
        dismissible
        show={openModal}
        onClose={handleClose}
        className=" register-form   "
      >
        <Modal.Body className="  sm:pl-10 pl-1 sm:pr-10 pr-1 sm:pb-10 pb-5 pt-0 helvetica  registerform ">
          <div className="">
            <h2 className="text-center font-bold text-white sm:text-2xl text-xl mt-4  ">
              Register
            </h2>
            <form className="mt-4 " onSubmit={registerSubmit}>
              <div className="flex flex-col gap-1 xl:gap-2 ">
                <label
                  className="text-gray-200 text-xs xl:text-base ms-[18px] mt-5"
                  style={{ marginTop: "24px", fontSize: "17px" }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute align-user ">
                    <img src={usericon} alt="user-icon" />
                  </span>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={handleChange}
                    placeholder="Enter full name"
                    autoComplete="name"
                    className="h-[40px] xl:h-[50px] w-full pl-14 bg-white googleLoginBtn inputBorder rounded-full text-white placeholder:text-black-400 xl:text-md text-sm sm:leading-6 focus:border-none focus:ring-black"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs ms-5 absolute -bottom-5 mt-5">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 xl:gap-2 w-full">
                <label
                  className="text-gray-300 text-xs xl:text-base ms-[18px] mt-5"
                  style={{ marginTop: "24px", fontSize: "17px" }}
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute align-user">
                    <img src={email} alt="user-icon" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="h-[40px] xl:h-[50px] w-full pl-14 bg-transparent googleLoginBtn inputBorder rounded-full text-white placeholder:text-gray-400 xl:text-md sm:leading-6 text-sm focus:border-none focus:ring-black"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs ms-5  absolute -bottom-5 mt-5">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 xl:gap-2 w-full">
                <label
                  className="text-gray-300 text-xs xl:text-base ms-[18px] mt-5"
                  style={{ marginTop: "24px", fontSize: "17px" }}
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute align-user">
                    <img src={password} alt="user-icon" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    className="h-[40px] xl:h-[50px] w-full pl-14 bg-transparent inputBorder googleLoginBtn rounded-full text-white  placeholder:text-gray-400 xl:text-md text-sm sm:leading-6 focus:border-none focus:ring-black mb-5"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs ms-5 absolute -bottom-5 mt-5">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
              <div
                className="flex justify-center items-center  gap-2 mt-5"
                style={{ marginTop: "30px" }}
              >
                <button
                  type="reset"
                  className="max-w-[200px] w-full sm:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black  "
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="max-w-[200px] w-full sm:h-[45px] h-[40px] bg-black text-white rounded-full hover:bg-white hover:text-black font-bold hover:border hover:border-black   "
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <Footer />
    </>
  );
};

export default Home;
