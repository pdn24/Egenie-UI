import React, { Fragment, useEffect, useState } from "react";
import editIcon from "../../../assets/icons/editIcon.svg";
import closeIcon from "../../../assets/icons/CloseCircleBlack.svg";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showAlert } from "../../utils/AlertService";

function AccountInfo() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  const [countryCodeList, setCountryCodeList] = useState();
  const [selectedCode, setSelectedCode] = useState({
    country_id: 1,
    id: 1,
    phone_code: "+91",
  });
  const [userInfo, setUserInfo] = useState();

  const userId = cookies.get("user_id");
  const apiUrl = process.env.REACT_APP_API_URL;

  const [userData, setUserData] = useState({
    login_id: "",
    user_name: "",
    // user_email: 'christinhume@02gmail.com',
    // country_code: selectedCode?.phone_code,
    // user_phonno: "",
  });
  const [errors, setErrors] = useState({
    login_id: "",
    user_name: "",
    // user_email: '',
    // user_phonno: "",
  });

  // const getCountryCodes = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${apiUrl}/user/get_phone_country_codes`,
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     setCountryCodeList(response.data);
  //   } catch (err) {
  //     console.log("err: ", err);
  //   }
  // };

  const fetchUserInfo = async () => {
    const data = {
      user_id: userId,
    };
    try {
      const response = await axios.post(`${apiUrl}/user/get_user_info`, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log('response: ', response)
      setUserInfo(response.data);

      // try {
      //   const responseCode = await axios.get(
      //     `${apiUrl}/user/get_phone_country_codes`,
      //     {
      //       headers: { "Content-Type": "application/json" },
      //     }
      //   );
      //   setCountryCodeList(
      //     responseCode.data.sort((a, b) => a.phone_code - b.phone_code)
      //   );
      //   const countryInfo = await responseCode?.data?.find(
      //     (code) =>
      //       code.phone_code === response?.data?.phone_number?.slice(0, -10)
      //   );
      //   setSelectedCode({
      //     country_id: countryInfo?.country_id,
      //     id: countryInfo?.id,
      //     phone_code: response?.data?.phone_number?.slice(0, -10),
      //   });
      // } catch (err) {
      //   console.log("err: ", err);
      // }

      setUserData({
        ...userData,
        login_id: response?.data?.email,
        user_name: response?.data?.name,
        // user_phonno: response.data.phone_number.slice(-10),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    // if (e.target.name === "user_phonno") {
    //     setUserData({ ...userData, [e.target.name]: e.target.value });
    // }
    setErrors({ ...errors, [e.target.name]: "" });
  };
const handleCancelEdit = () => {
   setIsEditMode(false);
   fetchUserInfo();
}

  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(" ");
  // }

  // const cc_format = (value) => {
  //     const v = value.replace(/[^0-9]/gi, "").substr(0, 10);
  //     const formatted = v.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  //     return formatted;
  // };

  const UpdateUserData = async () => {

    let formIsValid = true;
    const newErrors = { ...errors };
    // if (!userData.login_id) {
    //     newErrors.login_id = 'Old password is required'
    //     formIsValid = false
    // } else {
    //     newErrors.login_id = '';
    // }
    if (!userData.user_name) {
      newErrors.user_name = "User name is required";
      formIsValid = false;
    } else {
      newErrors.user_name = "";
    }
    // if (!userData.user_email) {
    //     newErrors.user_email = 'User email is required'
    //     formIsValid = false
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userData.user_email)) {
    //     newErrors.user_email = 'Please enter a valid email address'
    //     formIsValid = false
    // }
    // else {
    //     newErrors.user_email = '';
    // }

    // if (!userData.user_phonno) {
    //   newErrors.user_phonno = "User phon no. is required";
    //   formIsValid = false;
    // } else if (userData.user_phonno.length < 10) {
    //   newErrors.user_phonno = "Phon no must be 10 digit";
    //   formIsValid = false;
    // } else {
    //   newErrors.user_phonno = "";
    // }

    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }
    try {
      const data = {
        user_id: userId,
        name: userData.user_name,
        // phone_number: userData.user_phonno,
        // country_phone_code_id: selectedCode.country_id,
      };
      const response = await axios.post(
        `${apiUrl}/user/edit_account_info`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("response: ", response);
      showAlert(response.data.message, "success");
    } catch (e) {
      console.log("e: ", e);
      showAlert(
        e.response.data.error || e.message || "Something went wrong",
        "error"
      );
    }
    setIsEditMode(false);
  };

  useEffect(() => {
    const token = cookies.get("login_token");
    if (!token) {
      navigate("/login");
    } else {
      // getCountryCodes();
      fetchUserInfo();
    }
  }, []);

  return (
    <div className="bg-gray-100 h-full p-4 2xl:p-8 w-full helvetica flex flex-col ">
      <h2 className=" xl:text-3xl text-2xl font-bold">Account info</h2>
      <div className="w-full h-full overflow-y-auto whiteBgHeight bg-white shadow shadow-gray flex justify-between flex-col p-4 xl:mt-4 mt-1 rounded-xl">
        <div className="grid homeCardWrap grid-cols-1 gap-3 xl:gap-6 sm:grid-cols-1 lg:grid-cols-1 lg:py-5 2xl:px-10 xl:px-5 ">
          <div className="w-full">
            <div className="flex justify-between items-center gap-2">
              <h3 className="font-bold xl:text-2xl text-xl">
                Personal information
              </h3>
              {!isEditMode ? (
                <button
                  className="flex justify-center items-center gap-2 border p-1 rounded border-[#111111] max-w-[86px] w-full"
                  onClick={() => setIsEditMode(true)}
                >
                  <img src={editIcon} alt="edit icon" className="fs-5" />
                  <span style={{ fontWeight: 'bold', letterSpacing: "1px" }}>Edit</span>
                </button>
              ) : (
                <div className=" " style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="flex justify-center items-center pr-4 pl-3 gap-0 border p-1 rounded border-[#111111] max-w-[110px] w-full"
                    onClick={handleCancelEdit}
                  >
                    <img src={closeIcon} alt="edit icon" />
                    <span >Cancel</span>
                  </button>
                  <button
                    className="flex justify-center items-center gap-2 border p-1 rounded bg-black border-[#111111] max-w-[86px] w-full"
                    onClick={UpdateUserData}
                  >
                    {/* <img src={editIcon} alt='edit icon' className='brightness-200'/> */}
                    <span className="text-white">Save</span>
                  </button>
                </div>
              )}
            </div>
            <form className="h-[calc(100% - 80px)]">
              {/* <div className="border rounded mt-4 lg:h-[225px]"> */}
              <div className="border rounded mt-4 lg:h-full">
                <div className="grid grid-cols-1 gap-3 xl:gap-5 sm:grid-cols-2 md:grid-cols-2 p-4 items-start ">
                  <div className="flex flex-col justify-between w-full gap-2">
                    <label className="text-base xl:text-lg">
                      Login ID/Email
                    </label>
                    <input
                      type="text"
                      placeholder="Enter login id"
                      value={userData.login_id}
                      className="rounded borderLightThinGray placeholder:text-[#939393] bg-gray-200  text-[#939393] focus:ring-black"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col justify-between w-full gap-2 relative">
                    <label className="text-base xl:text-lg">Name</label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        name="user_name"
                        placeholder="Enter name"
                        value={userData.user_name}
                        className={`rounded w-full borderLightThinGray placeholder:text-[#939393] focus:ring-black ${!isEditMode && "text-[#939393]"
                          }`}
                        onChange={handleChange}
                        disabled={!isEditMode}
                      />
                      {errors.user_name && (
                        <p className="text-red-500 text-sm absolute -bottom-6">
                          {errors.user_name}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <div className='flex flex-col justify-between w-full gap-2 relative'>
                                        <label className='text-base xl:text-lg'>Email</label>
                                        <div className='relative w-full'>
                                            <input type="text" name='user_email' placeholder='Enter email' value={userData.user_email} className={`rounded w-full borderLightThinGray focus:ring-black placeholder:text-[#939393] ${!isEditMode && 'text-[#939393]'}`} onChange={handleChange} disabled={!isEditMode} />
                                            {errors.user_email &&
                                                <p className='text-red-500 text-sm absolute -bottom-6'>{errors.user_email}</p>}
                                        </div>
                                    </div> */}
                  {/* <div className='flex flex-col justify-between w-full gap-2 '>
                                        <label className='text-base xl:text-lg'>Phone</label>
                                        <div
                                            className='relative w-full'>
                                            <input type="text" name='user_phonno' value={userData.user_phonno} placeholder='Enter phon no.'
                                                className={`pl-[70px] w-full rounded borderLightThinGray focus:ring-black placeholder:text-[#939393] ${!isEditMode && 'text-[#939393]'}`}
                                                onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault() } }}
                                                maxLength={10} onChange={handleChange} disabled={!isEditMode} />

                                            <Listbox value={selectedCode} onChange={setSelectedCode} disabled={!isEditMode}>
                                                {({ open }) => (
                                                    <div className='absolute left-2 bottom-2' >
                                                        <div className="relative">
                                                            <Listbox.Button className="relative">
                                                                <div className="flex items-center">
                                                                    <span className="block text-[#939393]"><span></span>{selectedCode?.phone_code || "+00"}</span>
                                                                </div>
                                                                <span className="absolute flex items-center left-10 top-0">
                                                                    <ChevronDownIcon className="h-5 w-5 text-[#939393]" aria-hidden="true" />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-[70px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg poin">
                                                                    {countryCodeList &&
                                                                        countryCodeList.map((code, i) => (
                                                                            <Listbox.Option
                                                                                key={i}
                                                                                className={({ active }) =>
                                                                                    classNames(
                                                                                        active ? 'bg-gray-100 text-black' : 'text-gray-400',
                                                                                        'relative cursor-default select-none py-2 pl-3 pr-2'
                                                                                    )
                                                                                }
                                                                                value={code}
                                                                            >
                                                                                <div className="flex items-center">
                                                                                    <span
                                                                                        className='font-normal block cursor-pointer'
                                                                                    >
                                                                                        {code.phone_code}
                                                                                    </span>

                                                                                </div>
                                                                            </Listbox.Option>
                                                                        ))}
                                                                </Listbox.Options>
                                                            </Transition>
                                                        </div>
                                                    </div>
                                                )}
                                            </Listbox>
                                            {errors.user_phonno &&
                                                <p className='text-red-500 text-sm absolute -bottom-6'>{errors.user_phonno}</p>}
                                        </div>
                                    </div> */}
                </div>
              </div>
            </form>
          </div>
          <div className="w-full">
            <h3 className="font-bold xl:text-2xl text-xl">Subscriptions</h3>
            <div className="border mt-5 rounded lg:h-[225px]">
              <div className="flex gap-2 py-6 mx-6 border-b flex-wrap">
                <button className="bg-black rounded text-white text-base xl:text-lg font-bold max-w-[130px] xl:max-w-[160px] h-[44px] w-full">
                  {userInfo?.subscription[0]?.subscription_plan}
                </button>
                <button className="active:bg-black rounded active:text-white text-base xl:text-lg active:font-bold max-w-[160px] h-[44px] w-full">
                  {userInfo?.subscription[0]?.renewal_frequency}
                </button>
              </div>
              <div className="flex justify-between py-3 xl:py-4 px-6">
                <p className="xl:text-lg text-base text-gray-400">
                  Current Status
                </p>
                {userInfo?.subscription[0]?.status === "Active" ? (
                  <button className="text-[#28CF75] xl:w-[80px] w-[70px] xl:h-[33px] h-[30px] bg-[#DFF8EB] rounded ">
                    Active
                  </button>
                ) : (
                  <button className="text-[#da3434] xl:w-[85px] w-[80px] xl:h-[33px] h-[30px] bg-[#eeaba8] rounded ">
                    Deactive
                  </button>
                )}
              </div>
              <div className="flex justify-between xl:pb-5 pb-6 px-6">
                <p className="xl:text-lg text-gray-400">Renews on</p>
                <p className="xl:text-lg text-black">
                  {userInfo?.subscription[0]?.renewal_date}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;
