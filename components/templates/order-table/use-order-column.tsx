import moment from "moment"
import { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"
import { useTranslation } from "react-i18next"
import { getColor } from "../../../utils/color"
import { isoAlpha2Countries } from "../../../utils/countries"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import StatusDot from "../../fundamentals/status-indicator"
import { Badge } from "@medusajs/ui"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"

const useOrderTableColums = () => {
  const { t } = useTranslation()

  const decideFulfillmentBadge = (status) => {
    let badgeStyle;
    let badgeText;

    switch (status) {
      case "not_fulfilled":
        badgeStyle = {
          background: "linear-gradient(to right, #fc9a19, #facc34)",
          color: "white",
          fontSize: "12px",
          padding: "5px 10px",
        };
        badgeText = "Pending";
        break;
      case "fulfilled":
        badgeStyle = {
          background: "linear-gradient(to right, darkgreen, lightgreen)",
          color: "white",
          fontSize: "12px",
          padding: "5px 10px",
        };
        badgeText = "Fulfilled";
        break;
      // Handle other statuses here...
      default:
        badgeStyle = {
          background: "#696969", // Set background color for N/A
          color: "#fff", // Adjust text color for better readability
          fontSize: '12px',
          padding: '5px 22px'
        };
        badgeText = "N/A";
        break;
    }

    return <Badge style={badgeStyle}>{badgeText}</Badge>;
  };


  const decideStatus = (status) => {
    let badgeStyle;
    let badgeText;

    switch (status) {
      case "captured":
        badgeStyle = {
          background: "linear-gradient(to bottom right, #009245, #FCEE21)",
          color: "white",
          fontSize: "12px",
          padding: "5px 20px",
        };
        badgeText = "Paid";
        break;
      case "awaiting":
        badgeStyle = {
          background: "linear-gradient(to bottom right, #121C84, #8278DA)",
          color: "white",
          fontSize: "12px",
          padding: "5px 15px",
        };
        badgeText = "Unpaid";
        break;
      case "canceled":
        badgeStyle = {
          background: "linear-gradient(to bottom right, #FF512F, #DD2476)",
          color: "white",
          fontSize: "12px",
          padding: "5px 10px",
        };
        badgeText = "Canceled";
        break;
      default:
        badgeStyle = {
          background: "#878787",
          color: "white",
          fontSize: "12px",
          padding: "5px 22px",
        };
        badgeText = "N/A";
        break;
    }

    badgeStyle.borderRadius = '20px'; // Adjust as needed

    return <Badge style={badgeStyle}>{badgeText}</Badge>;
  }
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">{t("order-table-order", "Order")}</div>,
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: t("order-table-date-added", "Date added"),
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <div>
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </div>
        ),
      },
      {
        Header: t("order-table-customer", "Customer"),
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => (
          <div>
            <CustomerAvatarItem
              customer={{
                first_name:
                  value?.first_name ||
                  row.original.shipping_address?.first_name,
                last_name:
                  value?.last_name || row.original.shipping_address?.last_name,
                email: row.original.email,
              }}
              color={getColor(row.index)}
            />
          </div>
        ),
      },
      {
        Header: t("order-table-fulfillment", "Fulfillment"),
        accessor: "fulfillment_status",
        Cell: ({ cell: { value } }) => decideFulfillmentBadge(value),

      },
      {
        Header: t("order-table-payment-status", "Payment status"),
        accessor: "payment_status",
        Cell: ({ cell: { value } }) => decideStatus(value),
      },
      {
        Header: t("order-table-sales-channel", "Sales Channel"),
        accessor: "sales_channel",
        Cell: ({ cell: { value } }) => value?.name ?? "N/A",
      },
      {
        Header: () => (
          <div className="text-right">{t("order-table-total", "Total")}</div>
        ),
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </div>
        ),
      },
      {
        Header: "",
        accessor: "currency_code",
        Cell: ({ cell: { value } }) => (
          <div className="text-grey-40 text-right">{value.toUpperCase()}</div>
        ),
      },
      {
        Header: "",
        accessor: "country_code",
        Cell: ({ row }) => (
          <div className="pr-2">
            <div className="rounded-rounded flex w-full justify-end">
              <Tooltip
                content={
                  isoAlpha2Countries[
                    row.original.shipping_address?.country_code?.toUpperCase()
                  ] ||
                  row.original.shipping_address?.country_code?.toUpperCase()
                }
              >
                <ReactCountryFlag
                  className={"rounded"}
                  svg
                  countryCode={row.original.shipping_address?.country_code}
                />
              </Tooltip>
            </div>
          </div>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useOrderTableColums
