import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

const columns = (handleEditCategory) => [
  { name: "NOMBRE", selector: (row) => row.name, maxWidth: "120px" },
  {
    name: "DESCRIPCIÓN",
    selector: (row) => (
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {row.description}
      </div>
    ),
    minWidth: "400px",
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <div style={{ display: "flex", gap: "5px", flexDirection: "row" }}>
        <Link to={`/editar-categoria`}>
          <button
            className="ican-button act-rut"
            onClick={() => handleEditCategory(row)}
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
export function Categories() {
  const [datum, setDatum] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchDataAsync();
  }, []);

  useEffect(() => {
    const result = datum.filter((item) => {
      return item.name.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [search, datum]);

  const fetchDataAsync = async () => {
    const apiData = JSON.parse(localStorage.getItem("categorias"));
    setDatum(apiData.data);
    setFilter(apiData.data);
  };

  function handleEditCategory(categ) {
    localStorage.setItem("editCateg", JSON.stringify(categ));
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
      <DataTable
        name="datTab"
        columns={columns(handleEditCategory)}
        data={filter}
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
