import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { API_URL } from "../../auth/constants";
import { Tooltip } from "react-tooltip";

const token = JSON.parse(localStorage.getItem("token"));
const columns = [
  {
    name: "NOMBRE",
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
    name: "CORREO-E",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "unset",
        }}
      >
        {row.email}
      </div>
    ),
    minWidth: "200px",
  },
  { name: "CELULAR", selector: (row) => row.phone },
  {
    name: "DIRECCIÓN",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.address}
      </div>
    ),
    minWidth: "200px",
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
        <Tooltip id={`tt-delete`} />
        <button
          className="ican-button act-ccl"
          data-tooltip-id="tt-delete"
          data-tooltip-content="Eliminar usuario"
          data-tooltip-place="right"
          data-tooltip-float={false}
        >
          <i className="fas fa-times nav-icon" />
        </button>
      </div>
    ),
  },
];

const CustomNoDataComponent = () => (
  <div className="text-center">¡No hay registros para mostrar!</div>
);
export function Users() {
  const [datum, setDatum] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchDataAsync();
  }, [page, perPage]);

  useEffect(() => {
    const result = datum.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [search, datum]);

  const fetchDataAsync = async () => {
    try {
      const response = await fetch(
        `${API_URL}/users?pag=${page}&take=${perPage}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "Access-Control-Allow-Origin": "*",
            mode: "no-cors",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();
      setDatum(apiData.data);
      setFilter(apiData.data);
      setTotalRows(apiData.meta.itemsCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
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
      <DataTable
        columns={columns}
        data={filter}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
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
        subHeader
        subHeaderComponent={
          <div
            className="filterbari"
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyItems: "self-start",
              maxWidth: "auto",
              marginLeft: "-2rem",
            }}
          >
            <input
              type="text"
              className="custom-input-form"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
        subHeaderAlign="left"
      />
    </div>
  );
}
