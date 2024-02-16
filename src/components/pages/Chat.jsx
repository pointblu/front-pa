import React from "react";
import { WeavyComponent } from "../chats/chat";

export const Chat = () => {
  return (
    <div>
      {/* Content Wrapper. Contains page content */}

      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-8"
                  style={{ backgroundColor: "black" }}
                >
                  PQR CHAT
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content products">
          <div className="container-fluid">
            <WeavyComponent />
          </div>
        </section>
      </div>
    </div>
  );
};
