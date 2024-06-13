import { useEffect, useRef, useState } from "react";
import Search from "../../components/Search/Search";
import "./list.css";
import { GetAllRealestates } from "../../components/API/APIConfigure";
import Navbar from "../../components/navbar/Navbar";
import SearchItem from "../../components/searchItem/SearchItem";
import Filter from "../Filter/Filter";
import LoadingPage from "../../components/LoadingPage/LoadingPage";

const List = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchValueLoaded, setIsSearchValueLoaded] = useState(false);
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [dateDropdown, setDateDropdown] = useState(false);
  const [priceDropdown, setPricePropdown] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(
    `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} VND +`
  );
  const [showLoadingPage, setShowLoadingPage] = useState(false);

  const dropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setPricePropdown(false);
        setDateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown) => {
    if (dropdown === "date") {
      setDateDropdown(!dateDropdown);
      setPricePropdown(false);
    } else if (dropdown === "price") {
      setPricePropdown(!priceDropdown);
      setDateDropdown(false);
    }
  };
  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };
  const handleMinInputChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (!isNaN(value)) {
      setMinPrice(parseInt(value));
    }
  };
  const handleMaxInputChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (!isNaN(value)) {
      setMaxPrice(parseInt(value));
    }
  };
  const handleApplyFilter = () => {
    const priceRange = `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} VND +`;
    getData();
    setSelectedPriceRange(priceRange);
  };
  const resetFilter = () => {
    setMinPrice(1000);
    setMaxPrice(10000000);
  };
  useEffect(() => {
    const storedSearchTerm = localStorage.getItem("searchkey");
    if (storedSearchTerm) {
      const searchTerm = JSON.parse(storedSearchTerm);
      setSearchValue(searchTerm.location);
      setIsSearchValueLoaded(true);
    }
    getData();
  }, []);

  useEffect(() => {
    if (isSearchValueLoaded) {
      getData();
    }
  }, [isSearchValueLoaded]);
  const keepDiacritics = (str) => {
    return str.normalize("NFD");
  };
  useEffect(() => {
    getData();
  }, []);

  // const fetchCourtData = async () => {
  //     try {
  //         const response = await fetch('https://localhost:7155/api/Court', {
  //             method: 'GET',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //         });

  //         if (!response.ok) {
  //             throw new Error(`HTTP error! Status: ${response.status}`);
  //         }

  //         const data = await response.json();
  //         console.log('Response from API:', data);
  //     } catch (error) {
  //         console.error('Error fetching data:', error);
  //     }
  // };
  //     fetchCourtData();

  const getData = async () => {
    try {
      setShowLoadingPage(true);

      const response = await GetAllRealestates();
      console.log(response);
      if (response === null) {
        throw new Error("Network response was not ok");
      }

      setTimeout(() => {
        setShowLoadingPage(false);
        setSearchResult(response);
        console.log(response);
      }, 3000);

      setSearchResult(response);
    } catch (error) {
      console.log(error);
      setShowLoadingPage(false);
    }
  };

  const handleSearch = (searchValue) => {
    setShowLoadingPage(true);
    const searchTerm = {
      location: searchValue,
    };
    console.log(searchTerm);
    localStorage.setItem("searchkey", JSON.stringify(searchTerm));
    setSearchValue(searchValue);

    getData();
  };

  return (
    <div className="main-section">
      <div className="container-header">
        <Navbar />
      </div>
      <Search
        onSearch={handleSearch}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <Filter
        dropdownRef={dropdownRef}
        dateDropdownRef={dateDropdownRef}
        dateDropdown={dateDropdown}
        toggleDropdown={toggleDropdown}
        minPrice={minPrice}
        selectedPriceRange={selectedPriceRange}
        maxPrice={maxPrice}
        handlePriceChange={handlePriceChange}
        handleMinInputChange={handleMinInputChange}
        handleMaxInputChange={handleMaxInputChange}
        resetFilter={resetFilter}
        handleApplyFilter={handleApplyFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        priceDropdown={priceDropdown}
      />

      {showLoadingPage ? (
        <LoadingPage />
      ) : (
        <>
          {searchResult.length === 0 ? (
            <>
              <img
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: "center",
                  width: "40%",
                }}
                src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-6275834-5210416.png"
                alt="Không tìm thấy kết quả trùng khớp"
              />
              <div
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: "center",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                Không tìm thấy kết quả trùng khớp
              </div>
            </>
          ) : (
            <SearchItem searchResult={searchResult} />
          )}
        </>
      )}
    </div>
  );
};

export default List;
