import React from "react";
import "./Home.css";
import { useAuth } from "../../auth/AuthProvider";
export const Home = () => {
  const auth = useAuth();
  const userObject = JSON.parse(auth.getUser() || "{}");
  return (
    <div>
      {/* Content Wrapper. Contains page content */}
      <div className="container-fluid content-wrapper home-container">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-5"
                  style={{ backgroundColor: "#17a2b8" }}
                >
                  Inicio {userObject.name}
                </h1>
              </div>
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}

        <div className="wrappered">
          <ul className="container-publicity container-fluid">
            <li className="publicity">
              <img
                src={
                  "https://res.cloudinary.com/diitm4dx7/image/upload/v1702164821/kxyqnfckbz8896dartkg.jpg"
                }
                alt="p1"
              />
              <div className="info">
                <h1>heading</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem, quis?
                </p>
                <button className="icon-buttoni">
                  <i className="fas fa-shopping-basket" />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                  </sup>
                </button>
              </div>
            </li>
            <li className="publicity">
              <img
                src={
                  "https://res.cloudinary.com/diitm4dx7/image/upload/v1702164821/ybywjesmix5glubjlw2f.jpg"
                }
                alt="p1"
              />
              <div className="info ">
                <h1>heading</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem, quis?
                </p>
                <button className="icon-buttoni">
                  <i className="fas fa-shopping-basket" />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                  </sup>
                </button>
              </div>
            </li>
            <li className="publicity">
              <img
                src={
                  "https://res.cloudinary.com/diitm4dx7/image/upload/v1702164821/b86m2u25xdfsft3ltjac.jpg"
                }
                alt="p1"
              />
              <div className="info ">
                <h1>heading</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem, quis?
                </p>
                <button className="icon-buttoni">
                  <i className="fas fa-shopping-basket" />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                  </sup>
                </button>
              </div>
            </li>
            <li className="publicity">
              <img
                src={
                  "https://res.cloudinary.com/diitm4dx7/image/upload/v1702164821/kxyqnfckbz8896dartkg.jpg"
                }
                alt="p1"
              />
              <div className="info">
                <h1>heading</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem, quis?
                </p>
                <button className="icon-buttoni">
                  <i className="fas fa-shopping-basket" />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                  </sup>
                </button>
              </div>
            </li>
            <li className="publicity">
              <img
                src={
                  "https://res.cloudinary.com/diitm4dx7/image/upload/v1702164821/ybywjesmix5glubjlw2f.jpg"
                }
                alt="p1"
              />
              <div className="info ">
                <h1>heading</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem, quis?
                </p>
                <button className="icon-buttoni">
                  <i className="fas fa-shopping-basket" />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                  </sup>
                </button>
              </div>
            </li>
            <li className="publicity">
              <img
                src={
                  "https://res.cloudinary.com/diitm4dx7/image/upload/v1702164821/b86m2u25xdfsft3ltjac.jpg"
                }
                alt="p1"
              />
              <div className="info ">
                <h1>heading</h1>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Exercitationem, quis?
                </p>
                <button className="icon-buttoni">
                  <i className="fas fa-shopping-basket" />
                  <sup>
                    <i className="fas fa-plus nav-icon" />
                  </sup>
                </button>
              </div>
            </li>
          </ul>
        </div>
        {/* /.container-fluid */}

        {/* /.content */}
      </div>
    </div>
  );
};
