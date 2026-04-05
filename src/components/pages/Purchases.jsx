import DataTable from "react-data-table-component";
import api from "../../services/api";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.module.css";
import { format } from "date-fns";

registerLocale("es", es);
const columns = [
  {
    name: "FECHA",
    selector: (row) => (
      <div
        style={{
          maxHeight: "210px",
          overflow: "hidden",
          whiteSpace: "wrap",
          textOverflow: "unset",
        }}
      >
        {Intl.DateTimeFormat("es-ES", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        }).format(new Date(row.createdAt))}
      </div>
    ),
  },
  {
    name: "CATEGORÍA",
    selector: (row) => row.product.category.name,
    minWidth: "120px",
  },
  { name: "PRODUCTO", selector: (row) => row.product.name, minWidth: "160px" },
  {
    name: "COSTO UNIT.",
    selector: (row) => `$ ${row.product.cost}`,
    minWidth: "120px",
  },
  {
    name: "PRECIO UNIT.",
    selector: (row) => `$ ${row.product.price}`,
    minWidth: "120px",
  },
  { name: "CANTIDAD", selector: (row) => row.quantity },
  {
    name: "COSTO TOTAL",
    selector: (row) => `$ ${row.cost}`,
    minWidth: "120px",
  },
  { name: "TOTAL", selector: (row) => `$ ${row.subtotal}`, minWidth: "120px" },
  {
    name: "UTILIDAD",
    selector: (row) =>
      `$ ${((row.product.price - row.product.cost) * row.quantity).toFixed(2)}`,
  },
  {
    name: "MARGEN",
    selector: (row) =>
      `${(
        ((row.product.price - row.product.cost) / row.product.price) *
        100
      ).toFixed(2)} %`,
  },
];
const CustomNoDataComponent = () => (
  <div className="text-center">¡No hay registros para mostrar!</div>
);
export function PurchaseDetails() {
  const [datum, setDatum] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchDataAsync();
  }, [startDate, endDate, page, perPage]);

  useEffect(() => {
    const result = datum.filter((item) => {
      const nameMatch = item.product.name
        .toLowerCase()
        .match(search.toLocaleLowerCase());
      const categoryMatch = item.product.category.name
        .toLowerCase()
        .match(search.toLocaleLowerCase());
      return nameMatch || categoryMatch;
    });
    setFilter(result);
  }, [search, datum]);

  const fetchDataAsync = async () => {
    try {
      const start = startDate ? format(startDate, "yyyy-MM-dd") : "";
      const end = endDate ? format(endDate, "yyyy-MM-dd") : "";
      const { data: apiData } = await api.get(
        `/purchaseDetails?active=true&startDate=${start}&endDate=${end}&page=${page}&take=${perPage}`
      );
      setDatum(apiData.data);
      setFilter(apiData.data);
      setTotalRows(apiData.meta.itemsCount);
    } catch (_) {}
  };

  const handleChangeDate = (date) => {
    setStartDate(date[0]);
    setEndDate(date[1]);
  };

  const handleClearDate = () => {
    setStartDate(null);
    setEndDate(null);
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
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
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
            <div>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "0.6rem" }}
              >
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleChangeDate}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Seleccione un interválo"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  className="custom-input-form"
                />
                <button className="iconise-button" onClick={handleClearDate}>
                  <i className="fas fa-eraser nav-icon" />
                </button>
              </div>
            </div>
          </div>
        }
        subHeaderAlign="left"
      />
    </div>
  );
}
