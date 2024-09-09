import { Dropdown, Modal, Tooltip } from "flowbite-react";
import React, { useContext, useEffect, useState } from "react";
import "../../../assets/css/BulkFormat.css";
import calendarIcon from "../../../assets/icons/calendar-icon.svg";
import closeIcon from "../../../assets/icons/closeIcon.svg";
import closeRedIcon from "../../../assets/icons/closeRedIcon.svg";
import checkCircle from "../../../assets/icons/CheckCircle.svg";
import rightArrow from "../../../assets/icons/rightArrow.svg";
import infoGray from "../../../assets/icons/infoGray.svg";
import plusIcon from "../../../assets/icons/plusIcon.svg";
import restartGray from "../../../assets/icons/restartGray.svg";
import searchIcon from "../../../assets/icons/searchIcon.svg";
import sortGray from "../../../assets/icons/sortGray.svg";
import Pagination from "../../utils/Pagination";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { showAlert, showConfirmationDialog } from "../../utils/AlertService";
import UserContext from "../../../context/userInfoContext";

const useDebouncedValue = (inputValue, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
};

export default function BulkFormat() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { isStoreConnected } = useContext(UserContext);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openComparisonModal, setOpenComparisonModal] = useState(false);
  const [magicVisible, setMagicVisible] = useState(false);
  const [searchInput, setInputSearch] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchInput, 2000);
  const [totalPages, setTotalPages] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [originalProductData, setOriginalProductData] = useState([]);
  const [modifiedProductData, setModifiedProductData] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [seletedProductType, setSeletedProductType] = useState("");
  const [vendors, setVendors] = useState("");
  const [seletedVendor, setSeletedVendor] = useState("");
  const [periodValues, setPeriodValues] = useState([]);
  const [seletedPeriodValues, setSeletedPeriodValues] = useState(30); // set it to 1 as a default value given in figma
  const [seletedPeriodValueName, setSeletedPeriodValueName] = useState("");
  const [allFormatTypes, setAllFormatTypes] = useState([]);
  const [seletedFormatTypeName, setSeletedFormatTypeName] = useState("");
  const [formatSettingId, setFormatSettingId] = useState();
  const [selectedProductsForFormat, setSelectedProductsForFormat] = useState(
    []
  );
  const [customDateRange, setCustonDateRange] = useState([]);

  const [itemPerPage, setItemPerPage] = useState(10);

  const [selectedProcuct, setSelectedProduct] = useState({});
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [formatError, setFormatError] = useState("");

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const formatDate = (date1) => {
    const date = new Date(date1);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const formattedDate = {
    start_date:
      dateRange[0].startDate !== null ? formatDate(dateRange[0].startDate) : "",
    end_date:
      dateRange[0].endDate !== null ? formatDate(dateRange[0].endDate) : "",
  };

  // console.log('state: ', formatDate(dateRange[0].startDate))

  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = cookies.get("user_id");
  const storeId = localStorage.getItem("active_store_id");
  console.log('store_id', storeId)

  const handleDateRange = () => {
    setIsDateRangeOpen(!isDateRangeOpen);
    // setSeletedPeriodValues("custom")
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };
  const handleCustomDateRange = () => {
    setSeletedPeriodValueName("Custom date");
    setSeletedPeriodValues("custom");
    setIsDateRangeOpen(!isDateRangeOpen);
    setCustonDateRange(true);
  };

  useEffect(() => {
    const token = cookies.get("login_token");
    if (!token) {
      navigate("/login");
    } else if (!isStoreConnected) {
      navigate("/connectstore2");
    }
  }, []);

  const fetchProducts = async () => {
    const data = {
      store_id: storeId,
      number_of_products_per_page: itemPerPage,
      date_option: seletedPeriodValues,
      start_date: formattedDate.start_date,
      end_date: formattedDate.end_date,
      vendor: seletedVendor,
      product_category: "",
      product_type: seletedProductType,
      search_query: searchInput,
      page_number: currentPage,
    };
    const typeData = {
      user_id: userId,
      store_id: storeId,
    };
    const vendorData = {
      user_id: userId,
      store_id: storeId,
    };
    try {
      setLoading(true);
      const prouctResponse = await axios.post(
        `${apiUrl}/products/fetch_products`,
        data
      );
      setProducts(prouctResponse.data?.products);
      setTotalPages(prouctResponse.data.total_number_of_pages);
      try {
        if (productTypes.length === 0) {
          const TypeResponse = await axios.post(
            `${apiUrl}/shopify/get_product_types`,
            typeData
          );
          setProductTypes(TypeResponse.data?.product_types);
        }
      } catch (err) {
        console.log("err for fatching product types ", err);
      }

      try {
        if (vendors.length === 0) {
          const VendorResponse = await axios.post(
            `${apiUrl}/shopify/get_vendors`,
            vendorData
          );
          setVendors(VendorResponse.data.vendors);
        }
      } catch (err) {
        console.log("err for fatching vendor", err);
      }

      try {
        if (periodValues.length === 0) {
          const PeriodValueResponse = await axios.get(
            `${apiUrl}/search/get_values_for_period_dropdown`
          );
          setPeriodValues(PeriodValueResponse.data);
        }
      } catch (err) {
        console.log("err for fatching vendor", err);
      }
      setLoading(false);
    } catch (error) {
      console.log("error to fetch products", error);
      setLoading(false);
    }
  };

  const fetchAllForamtTypes = async () => {
    try {
      const data = {
        user_id: userId,
        store_id: storeId,
      };
      if (allFormatTypes.length === 0) {
        const allFormatTypesResponse = await axios.post(
          `${apiUrl}/templates/get_all_format_types`,
          data
        );
        setAllFormatTypes(allFormatTypesResponse.data);
      }
    } catch (err) {
      console.log("err for fatching formats", err);
    }
  }

  const handleProductType = async (type) => {
    setSeletedProductType(type);
  };

  const handleVendor = async (item) => {
    setSeletedVendor(item);
  };

  const handlePeriodValues = async (period) => {
    setDateRange([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
    setSeletedPeriodValueName(period?.name || period);
    setSeletedPeriodValues(period?.value || 30);
  };

  const handleAllFormatTypes = async (types) => {
    setSeletedFormatTypeName(types?.setting_name);
    setFormatSettingId(types?.id);
    setFormatError("");
  };

  useEffect(() => {
    fetchProducts();
  }, [
    seletedPeriodValues,
    seletedVendor,
    seletedProductType,
    customDateRange,
    debouncedSearchTerm,
    currentPage,
  ]);

  // useEffect(() => {

  // }, [debouncedSearchTerm]);

  const toggleMagicBar = () => {
    setMagicVisible(!magicVisible);
    setSelectedProductsForFormat([]);
  };
  const handleMagicZone = (product, e) => {
    if (e.target.checked) {
      fetchAllForamtTypes();
    }
    setSelectedProductsForFormat((prevSelectedProductsForFormat) => {
      if (prevSelectedProductsForFormat.some((p) => p.shopify_product_id === product.shopify_product_id)) {
        return prevSelectedProductsForFormat.filter((p) => p.shopify_product_id !== product.shopify_product_id);
      } else {
        return [...prevSelectedProductsForFormat, product];
      }
    });
  };

  useEffect(() => {
    if (selectedProductsForFormat.length > 0) {
      setMagicVisible(true);
    } else {
      setMagicVisible(false);
    }
  }, [selectedProductsForFormat]);

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      fetchAllForamtTypes();
    }
    if (e.target.checked) {
      setSelectedProductsForFormat(products);
    } else {
      setSelectedProductsForFormat([]);
    }
  };
  const convertStringifyProducts = () => {
    return selectedProductsForFormat.map((item) => {
      const { id, title, description, product_type, tags, shopify_product_id } = item;
      const data = JSON.stringify({
        id: shopify_product_id,
        title,
        description,
        product_type,
        tags: tags.join(", "),
      });
      return data;
    });
  };
  const handleSetFormatted = async () => {
    const data = {
      selected_products: convertStringifyProducts(),
      format_setting_id: formatSettingId,
      store_id: parseInt(storeId),
    };

    if (formatSettingId === undefined) {
      setFormatError("Please select format Type")
      return;
    }
    try {
      setLoading(true)
      const response = await axios.post(`${apiUrl}/products/format_products`, data)
      showAlert(response.data?.message || "Product Formatted Successfully", "success")
      setSelectedProductsForFormat([])
      setMagicVisible(false);
      fetchProducts()
    } catch (err) {
      console.log('err for format ', err)
      showAlert(err.response?.data?.error || err.message || "Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  };
  const handleProductDetail = (id) => {
    const selected = products.find((product) => (product.shopify_product_id === id))
    setSelectedProduct(selected)
    setOpenDetailModal(true);
  }
  const handleRevertProduct = async (id) => {
    const data = {
      product_id: id,
      user_id: userId,
      store_id: storeId,
    }
    const confirmation = await showConfirmationDialog(
      "Are you sure you want to Revert ?",
      "",
      "warning"
    );
    try {
      if (confirmation) {
        setLoading(true);
        await axios.post(`${apiUrl}/products/restore_original_product_data`, data, {
          headers: { 'Content-Type': 'application/json', },
        })
        fetchProducts()
        showAlert('Original product Restored successfully', 'success')
      }
    } catch (err) {
      console.log('err: In revert product  ', err)
    } finally {
      setLoading(false);
    }
  }
  const handleProductComparison = async (id) => {
    const data = { product_id: id }
    try {
      const response = await axios.post(`${apiUrl}/products/get_original_product_data_for_comparison`, data, {
        headers: { 'Content-Type': 'application/json', },
      })
      setOriginalProductData(response.data)
    } catch (err) {
      console.log('err: ', err)
    }

    try {
      const response = await axios.post(
        `${apiUrl}/products/get_formatted_data_for_comparison`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setModifiedProductData(response.data);
    } catch (err) {
      console.log("err: ", err);
    }
    setOpenComparisonModal(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="block lg:flex bg-gray-100 h-[91.5vh] lg:h-screen overflow-y-auto lg:overflow-y-hidden">
        <div className="flex w-full">
          <div className="w-full overflow-x-auto lg:overflow-y-hidden">
            <div className="p-6 sm:p-9 ">
              <div className="flex gap-4 w-full items-center justify-start bulkFormatHedding flex-wrap">
                <h2 className="sm:text-2xl md:text-3xl text-xl font-bold min-w-[250px] text-center w-fit  ">
                  Bulk Format page
                </h2>
                <div className="flex justify-between items-center helvetica flex-wrap gap-2 inputAlign w-fit	">
                  <div className="relative">
                    <img
                      src={searchIcon}
                      width={20}
                      alt="search icon"
                      className="absolute z-100 left-2 searchIcon"
                    />
                    <input
                      placeholder="Search"
                      className="py-2 pl-9 bg-transparent sm:h-[50px] h-[36px] border rounded-md w-[200px]  md:w-[270px] xl:w-[350px] max-w-[350px] borderLightThinGray"
                      onChange={(e) => {
                        setInputSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 my-4 flex-wrap justify-center sm:justify-start ">
                <div className="relative">
                  <Dropdown
                    label={seletedPeriodValueName || "Period"}
                    className="option-height"
                  >
                    <Dropdown.Item onClick={() => handlePeriodValues("period")}>
                      Period
                    </Dropdown.Item>
                    {periodValues &&
                      periodValues.map((period, index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handlePeriodValues(period)}
                        >
                          {period.name}
                        </Dropdown.Item>
                      ))}
                    <Dropdown.Item onClick={handleDateRange}>
                      <div className="flex items-center justify-between w-full pr-2">
                        <div className="flex items-center gap-2">
                          <img src={plusIcon} alt="plus icon" />
                          <span className="text-black font-semibold">
                            Custom date
                          </span>
                        </div>
                        <img src={calendarIcon} alt="calendar icon" />
                      </div>
                    </Dropdown.Item>
                  </Dropdown>
                </div>

                <div className="relative">
                  <Dropdown
                    label={seletedVendor || "Vendor"}
                    className="option-height"
                  >
                    <Dropdown.Item onClick={() => handleVendor("")}>
                      Vendor
                    </Dropdown.Item>
                    {vendors &&
                      vendors.map((index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleVendor(index)}
                        >
                          {index}
                        </Dropdown.Item>
                      ))}
                  </Dropdown>
                </div>
                <div className="relative">
                  <Dropdown
                    label={seletedProductType || "Product Type"}
                    className="option-height"
                  >
                    <Dropdown.Item onClick={() => handleProductType("")}>
                      Product Type
                    </Dropdown.Item>
                    {productTypes &&
                      productTypes.map((index) => (
                        <Dropdown.Item
                          key={index}
                          onClick={() => handleProductType(index)}
                        >
                          {index}
                        </Dropdown.Item>
                      ))}
                  </Dropdown>
                </div>
              </div>
              <div className="relative">
                {isDateRangeOpen && (
                  <div className="absolute top-0 left-0 z-50">
                    <div className="relative date-picker">
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDateRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        className="border shadow-xl"
                      />
                      <button
                        className="py-1 px-3 rounded bg-black text-white font-bold absolute bottom-0 right-0 text-[10px]"
                        onClick={handleCustomDateRange}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div
                  className={`overflow-x-auto tableHeight bg-white rounded-xl justify-center ${loading
                    ? "flex flex-col-reverse items-center !justify-center"
                    : ""
                    }}`}
                >
                  {loading && (
                    <div className="flex items-center justify-center">
                      <div className="spinner"></div>
                    </div>
                  )}
                  <table
                    className={`w-full rounded-lg min-w-[650px] ${loading ? "absolute top-0" : ""
                      } ${isDateRangeOpen ? "blur-[5px]" : ""}`}
                  >
                    <thead className=" text-black text-left helvetica border-b border-gray-100 sticky top-0 bg-white  z-9">
                      <tr>
                        <th scope="col" className="p-4 rounded-xl">
                          <input
                            type="checkbox"
                            value=""
                            className="w-4 h-4 rounded focus:right-0 checked:bg-black focus:ring-0 cursor-pointer"
                            onChange={handleCheckAll}
                            checked={
                              products.length > 0 &&
                              selectedProductsForFormat.length ===
                              products.length
                            }
                          />
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-3 text-xs sm:text-sm xl:text-base"
                        >
                          Image
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-3 max-w-[420px] text-xs sm:text-sm xl:text-base"
                        >
                          <span className="max-w-[300px]"> Title</span>
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-3 text-center text-xs sm:text-sm xl:text-base"
                        >
                          Formatted
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-3 text-center text-xs sm:text-sm xl:text-base whitespace-nowrap"
                        >
                          Created At
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-3 text-center text-xs sm:text-sm xl:text-base whitespace-nowrap"
                        >
                          Product Type
                        </th>
                        <th
                          scope="col"
                          className="px-1 py-3 text-center text-xs sm:text-sm xl:text-base sticky right-0 bg-white"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {products?.length > 0 && !loading
                        ? products.map((product, i) => (
                          <tr className="border-b border-gray-100" key={i}>
                            <td className="w-4 p-4">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded checked:bg-black focus:ring-0 cursor-pointer"
                                onChange={(e) => handleMagicZone(product, e)}
                                checked={selectedProductsForFormat.some(
                                  (p) => p.shopify_product_id === product.shopify_product_id
                                )}
                              />
                            </td>
                            <td className="px-1 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="w-[100px] h-[100px] rounded border">
                                <img
                                  src={product.image_url}
                                  alt="product"
                                  className="w-full h-full rounded"
                                />
                              </div>
                            </td>
                            <td className="px-1 py-4 align-top font-medium text-xs sm:text-sm xl:text-base">
                              {product.title}
                            </td>
                            <td className="px-1 py-4 align-top text-center">
                              <button>
                                <img
                                  src={
                                    product.modified_by_egenie
                                      ? checkCircle
                                      : closeRedIcon
                                  }
                                  alt="close red icon"
                                />
                              </button>
                            </td>
                            <td className="px-1 py-4 align-top text-center font-medium text-xs sm:text-sm xl:text-base whitespace-nowrap">
                              {formatDate(product.created_at)}
                            </td>
                            <td className="px-1 py-4 align-top text-center font-medium text-xs sm:text-sm xl:text-base">
                              {product.product_type}
                            </td>
                            <td className="px-1 py-4 align-top text-center flex justify-center gap-3 sticky right-0 bg-white">
                              <Tooltip content="Info" placement="bottom">
                                <button
                                  onClick={() =>
                                    handleProductDetail(product.shopify_product_id)
                                  }
                                >
                                  {" "}
                                  <img
                                    src={infoGray}
                                    className={`${product.modified_by_egenie
                                      ? "brightness-0"
                                      : "brightness-90"
                                      } min-w-4`}
                                    alt="info"
                                  />
                                </button>
                              </Tooltip>
                              <Tooltip content="Revert" placement="bottom">
                                <button
                                  onClick={() =>
                                    handleRevertProduct(product.shopify_product_id)
                                  }
                                  disabled={!product.modified_by_egenie}
                                >
                                  {" "}
                                  <img
                                    src={restartGray}
                                    className={`${product.modified_by_egenie
                                      ? "brightness-0"
                                      : "brightness-90"
                                      } min-w-4`}
                                    alt="restart gray"
                                  />
                                </button>
                              </Tooltip>
                              <Tooltip content="Compare" placement="bottom">
                                <button
                                  onClick={() =>
                                    handleProductComparison(product.product_id)
                                  }
                                  disabled={!product.modified_by_egenie}
                                >
                                  {" "}
                                  <img
                                    src={sortGray}
                                    className={`${product.modified_by_egenie
                                      ? "brightness-0"
                                      : "brightness-90"
                                      } min-w-4`}
                                    alt="sort gray"
                                  />
                                </button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))
                        : !loading && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-1 py-4 align-top text-center font-medium text-xs sm:text-sm xl:text-base"
                            >
                              <p>No Product Found</p>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                  {products?.length > 0 && !loading && (
                    <div className="sticky bottom-0">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {magicVisible ? (
            <div className="max-w-[300px] xl:max-w-[400px] w-full sm:relative absolute right-0">
              <div className="h-[90vh] lg:h-screen bg-white flex justify-between flex-col p-3">
                <div className="mt-5">
                  <div className="text-end">
                    <button type="button" onClick={toggleMagicBar}>
                      <img src={closeIcon} alt="close icon" />
                    </button>
                  </div>
                  <div className="p-4 mt-3  ">
                    <div className="flex items-center justify-between">
                      <h2 className="sm:text-2xl text-xl font-bold">
                        Format Type
                      </h2>
                      <p className="sm:text-base text-sm text-[#9B9B9B]">
                        {selectedProductsForFormat.length > 0
                          ? selectedProductsForFormat.length
                          : 0}{" "}
                        selected
                      </p>
                    </div>
                    <div className="input-dropdown my-8">
                      <div className="relative">
                        <Dropdown
                          label={seletedFormatTypeName || "Format Types"}
                          className="option-height"
                        >
                          <Dropdown.Item disabled>
                            Select Format Setting...{" "}
                          </Dropdown.Item>
                          {allFormatTypes &&
                            allFormatTypes.map((types, index) => (
                              <Dropdown.Item
                                key={index}
                                onClick={() => handleAllFormatTypes(types)}
                              >
                                {types.setting_name}
                              </Dropdown.Item>
                            ))}
                        </Dropdown>
                        {formatError && (
                          <p className="text-red-500 text-sm ms-1 -bottom-8">
                            {formatError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-5 p-3">
                  <button
                    className={`bg-black rounded-3xl w-full sm:h-[45px] h-[40px] sm:text-base text-sm text-white ${loading && "bg-gray-500"
                      }`}
                    onClick={handleSetFormatted}
                    disabled={loading}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* product description modal */}

      <Modal
        dismissible
        show={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
      >
        <Modal.Header className="border-0 p-2"></Modal.Header>
        <Modal.Body className="pl-10 pr-10 pb-10 pt-0 helvetica">
          <div>
            <h2 className="text-center font-bold sm:text-2xl text-xl">
              Product Details
            </h2>
            <p className="sm:text-xl text-lg font-medium text-center">
              {selectedProcuct.title}
            </p>
            <div className="flex justify-center my-5">
              <div className="w-[125px] h-[125px] border rounded">
                <img
                  src={selectedProcuct.image_url}
                  alt="table popup img"
                  className="w-full h-full rounded"
                />
              </div>
            </div>
            <p className="text-[#9B9B9B] sm:text-xl text-base font-medium">
              <span className="text-black">Description :</span>{" "}
              {selectedProcuct.description}
            </p>
            <p className="text-[#9B9B9B] sm:text-xl text-base my-2 font-medium">
              <span className="text-black"> Product type : </span>
              {selectedProcuct.product_type}
            </p>
            <div className="text-[#9B9B9B] sm:text-xl text-base font-medium">
              <span className="text-black"> Tags : </span>
              {selectedProcuct?.tags?.map((index) => (
                <span key={index}>
                  {index}
                  {","}
                </span>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* product comparison modal */}

      <div className="comparisonPop">
        <Modal
          style={{ minWidth: "85vw" }}
          dismissible
          show={openComparisonModal}
          onClose={() => setOpenComparisonModal(false)}
        >
          <Modal.Header className="border-0 p-2"></Modal.Header>
          <Modal.Body className="pl-10 pr-10 pb-10 pt-0 helvetica overflow-y-auto max-h-[770px] ">
            <div className="flex lg:gap-10 gap-4">
              <div className="bg-[#F9F9F9] border border-1 p-5 rounded-xl w-[50%]">
                <h2 className="text-black font-bold text-2xl mb-2">
                  Original Product Data
                </h2>
                <p className="text-xl my-2 font-medium text-black"> Title :</p>
                <p className="text-[#9B9B9B] text-base">
                  {originalProductData.title}
                </p>
                <p className="text-black text-justify text-xl font-medium mt-2 mb-1">
                  Description :{" "}
                </p>
                <p className="text-[#9B9B9B] text-base">
                  {originalProductData.body_html}
                </p>
                <p className="text-xl my-2 font-medium text-black">
                  {" "}
                  Product type :
                </p>
                <p className="text-[#9B9B9B] text-base">
                  {originalProductData.product_type}
                </p>
                <p className="text-black text-justify text-xl font-medium mt-2 mb-1">
                  Tags :{" "}
                </p>
                <p className="text-[#9B9B9B] text-base">
                  {originalProductData.tags}
                </p>
              </div>

              <div className="relative flex items-center">
                <div className="fixed top-[45%] -ml-6 lg:-ml-[52px]">
                  <div className="lg:w-[100px] lg:h-[100px] w-[50px] h-[50px] bg-black rounded-full p-1.5 relative">
                    <div className="border-3 border-white rounded-full h-full w-full flex justify-center items-center">
                      <div className="">
                        <img src={rightArrow} alt="arrow" className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9F9F9] border border-1 p-5 rounded-xl w-[50%]">
                <h2 className="text-black font-bold text-2xl mb-2">
                  Formatted Product Data
                </h2>
                <p className="text-xl mt-2 mb-1 font-medium text-black">
                  {" "}
                  Title :
                </p>
                <p className="text-[#9B9B9B] text-base">
                  {modifiedProductData.title}
                </p>
                <p className="text-black text-justify text-xl font-medium mt-2 mb-1">
                  Description :{" "}
                </p>
                <p className="text-[#9B9B9B] text-base">
                  {modifiedProductData.body_html}
                </p>
                <p className="text-xl mt-2 font-medium text-black">
                  {" "}
                  Product type :
                </p>
                <p className="text-[#9B9B9B] text-base">
                  {modifiedProductData.product_type}
                </p>
                <p className="text-black text-justify text-xl font-medium mt-2 mb-1">
                  Tags :{" "}
                </p>
                <p className="text-[#9B9B9B] text-base">
                  {modifiedProductData.tags}
                </p>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
