import React, { useEffect, useState } from "react";
import { useFilters } from "../../hooks/useFilters.jsx";
import { API_URL } from "../../auth/constants";
import { fetchData } from "../../fetchData/fetchData";

const apiData = fetchData(`${API_URL}/categories`);

export function Filters() {
  const categories = apiData.read();
  const { setFilters } = useFilters();
  const [activeCategory, setActiveCategory] = useState(null);
  const handleCategoryClick = (categId, categName) => {
    setActiveCategory(categId);
    setFilters((prevState) => ({
      ...prevState,
      category: categId !== "all" ? categName : "all",
    }));
  };

  useEffect(() => {
    const rightArrow = document.querySelector(".scrollable .right-arrow i");
    const leftArrow = document.querySelector(".scrollable .left-arrow i");
    const tabList = document.querySelector(".scrollable ul");

    const handleRightArrowClick = () => {
      tabList.scrollLeft += 200;
    };

    const handleLeftArrowClick = () => {
      tabList.scrollLeft -= 200;
    };

    if (rightArrow) {
      rightArrow.addEventListener("click", handleRightArrowClick);
    }

    if (leftArrow) {
      leftArrow.addEventListener("click", handleLeftArrowClick);
    }

    return () => {
      // Cleanup: remove event listeners when the component unmounts
      if (rightArrow) {
        rightArrow.removeEventListener("click", handleRightArrowClick);
      }

      if (leftArrow) {
        leftArrow.removeEventListener("click", handleLeftArrowClick);
      }
    };
  }, []);

  return (
    <div>
      <div
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 1000,
          top: "3.5rem",
        }}
      >
        <div className="navbar navbar-expand navbar-dark navbar-light  justify-content-center">
          <div className="sidebar scrollable">
            {/* Sidebar Menu */}
            <div className="left-arrow active">
              <i className="fas fa-chevron-left text-white" />
            </div>
            <nav className="mt-2">
              <ul className="nav nav-pills navbar-nav d-flex flex-row flex-nowrap ">
                <li
                  className={`mx-2 text-white ${
                    activeCategory === "all" ? "active" : ""
                  }`}
                  style={{ fontSize: "0.8rem", cursor: "pointer" }}
                  onClick={() => handleCategoryClick("all")}
                >
                  TODAS
                </li>
                {categories.data.map((categ) => {
                  return (
                    <li
                      className={`mx-2 text-white ${
                        categ.id === activeCategory ? "active" : ""
                      }`}
                      key={categ.id}
                      style={{ fontSize: "0.8rem", cursor: "pointer" }}
                      onClick={() => handleCategoryClick(categ.id, categ.name)}
                    >
                      {categ.name.toUpperCase()}
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="right-arrow active">
              <i className="fas fa-chevron-right text-white" />
            </div>
            {/* /.sidebar-menu */}
          </div>
          {/* /.sidebar */}
        </div>
      </div>
    </div>
  );
}
