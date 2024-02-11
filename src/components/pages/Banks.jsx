import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { Tooltip } from "react-tooltip";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";

const token = JSON.parse(localStorage.getItem("token"));

const columns = (handleEditBank) => [
  {
    name: "CUENTA",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.name}
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "TIPO",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "unset",
        }}
      >
        {row.type}
      </div>
    ),
    minWidth: "200px",
  },
  { name: "NÚMERO", selector: (row) => row.account },
  {
    name: "ACCIONES",
    cell: (row) => (
      <div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
        <Tooltip id="tt-action" />
        <Link to={`/editar-cuenta`}>
          <button
            className="ican-button act-rut"
            onClick={() => handleEditBank(row)}
            data-tooltip-id="tt-action"
            data-tooltip-content="editar"
            data-tooltip-place="left"
            data-tooltip-float={false}
            data-tooltip-class-name="custom-tooltip"
          >
            <i className="fas fa-edit nav-icon" />
          </button>
        </Link>
      </div>
    ),
  },
];

const CustomNoDataComponent = () => (
  <div className="text-center">¡No hay registros para mostrar!</div>
);

export function Banks() {
  const [datum, setDatum] = useState([]);

  useEffect(() => {
    fetchDataAsync();
  }, []);

  const fetchDataAsync = async () => {
    try {
      const response = await fetch(`${API_URL}/banks`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
          mode: "no-cors",
        },
      });

      if (!response.ok) {
        toast.error("Ups!; Algo salio mal");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();

      setDatum(apiData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function handleEditBank(categ) {
    localStorage.setItem("editBank", JSON.stringify(categ));
  }
  const tableHeaderstyle = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "12px",
      },
    },
  };

  return (
    <div>
      <Toaster position="top-center" richColors />
      <DataTable
        columns={columns(handleEditBank)}
        data={datum.data}
        pagination
        customStyles={tableHeaderstyle}
        fixedHeader
        paginationComponentOptions={{
          rowsPerPageText: "Registros por página:",
          rangeSeparatorText: "de",
          noRowsPerPage: false,
          selectAllRowsItem: false,
          selectAllRowsItemText: "Todas",
        }}
        noDataComponent={<CustomNoDataComponent />}
      />
    </div>
  );
}
