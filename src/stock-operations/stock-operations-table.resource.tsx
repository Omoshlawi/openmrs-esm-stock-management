import {
  StockOperationFilter,
  useStockOperations,
} from "./stock-operations.resource";
import { useMemo, useState } from "react";
import { usePagination } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";

export function useStockOperationPages(filter: StockOperationFilter) {
  const { items, isLoading, isError } = useStockOperations(filter);

  const pageSizes = [10, 20, 30, 40, 50];
  const [currentPageSize, setPageSize] = useState(10);

  const {
    goTo,
    results: paginatedQueueEntries,
    currentPage,
  } = usePagination(items.results, currentPageSize);

  const { t } = useTranslation();

  const tableHeaders = useMemo(
    () => [
      {
        id: 0,
        header: t("type", "Type"),
        key: "type",
      },
      {
        id: 1,
        header: t("number", "Number"),
        key: "number",
      },
      {
        id: 2,
        header: t("status", "Status"),
        key: "status",
      },
      {
        id: 3,
        header: t("location", "Location"),
        key: "location",
      },
      {
        id: 4,
        header: t("responsiblePerson", "Responsible Person"),
        key: "responsiblePerson",
      },
      {
        id: 5,
        header: t("date", "Date"),
        key: "Date",
      },
      {
        id: 6,
        header: "actions",
      },
    ],
    [t]
  );

  return {
    items: items.results,
    currentPage,
    paginatedQueueEntries,
    goTo,
    pageSizes,
    isLoading,
    isError,
    setPageSize,
    tableHeaders,
  };
}