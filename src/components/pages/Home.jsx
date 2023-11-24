import React from 'react'
export const Home=()=> {
  return (
    <div>
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
              <h1 className="m-0 App-header focus-in-contract alphi-5"  style={{ backgroundColor: "#17a2b8" }}>Inicio</h1>
              </div>
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid cont-a">
            <div className="row cont-b">
            
            <div>
              <div className="tarjeta" id="bakugo"><h3>TRIDENT</h3></div>
              <div className="tarjeta" id="deku"><h3>LAY'S</h3></div>
              <div className="tarjeta" id="todoroki"><h3>PONY</h3></div>
              <div className="tarjeta" id="Red_Riot"><h3>NUTELLA</h3></div>
              <div className="tarjeta" id="lemillion"><h3>TENTAZIONE</h3></div>
              <div className="tarjeta" id="all_might"><h3>AGUA</h3></div>
              <div className="tarjeta" id="shigaraki"><h3>GATORADE</h3></div>
              <div className="tarjeta" id="all_for_one"><h3>CONTÉ</h3></div>
            </div>

	
            </div>

            <div className="row"></div>
            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
}

