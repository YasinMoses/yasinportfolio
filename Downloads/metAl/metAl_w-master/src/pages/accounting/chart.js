import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DateRangePicker } from "react-date-range";
import { addDays, endOfDay } from "date-fns";
import Modal from "@material-ui/core/Modal";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "./../../components/panel/panel.jsx";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LineController,
  BarController,
  RadarController,
  PolarAreaController,
  PieController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Line,
  Bar,
  Radar,
  PolarArea,
  Pie,
  Doughnut,
} from "react-chartjs-2";
import { getInvoices } from "./../../services/invoices.js";
import { getExpenses } from "./../../services/expenses.js";
import auth from "./../../services/authservice";
import { getUser } from "./../../services/users";
import { defaultStaticRanges, createStaticRanges } from "react-date-range";

// Register the necessary components
ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LineController,
  BarController,
  RadarController,
  PolarAreaController,
  PieController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
);

const date = new Date();
const year = date.getFullYear();

const staticRanges = [
  ...defaultStaticRanges,
  ...createStaticRanges([
    {
      label: "Quater1",
      range: () => ({
        startDate: new Date(year, 0),
        endDate: new Date(year, 3),
      }),
    },
    {
      label: "Quater2",
      range: () => ({
        startDate: new Date(year, 3),
        endDate: new Date(year, 6),
      }),
    },
    {
      label: "Quater3",
      range: () => ({
        startDate: new Date(year, 6),
        endDate: new Date(year, 9),
      }),
    },
    {
      label: "Quater4",
      range: () => ({
        startDate: new Date(year, 9),
        endDate: new Date(year, 11),
      }),
    },
  ]),
];

const ChartBiz = () => {
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [invoices, setinvoices] = useState([
    100, 200, 300, 400, 500, 600, 600, 500, 400, 300, 200, 100,
  ]);
  const [expenses, setexpenses] = useState([
    150, -150, 300, 450, 250, 550, 550, 250, 450, 300, -150, 150,
  ]);
  const [profitloss, setprofitloss] = useState([]);

  // const getStartDateAndEndDate = () => {
  //   const currentDate = new Date();

  //   // Calculate the start date of the current week (Monday)
  //   const startOfWeek = new Date(currentDate);
  //   startOfWeek.setDate(
  //     currentDate.getDate() -
  //       currentDate.getDay() +
  //       (currentDate.getDay() === 0 ? -6 : 1)
  //   );

  //   // Calculate the end date of the current week (Sunday)
  //   const endOfWeek = new Date(currentDate);
  //   endOfWeek.setDate(startOfWeek.getDate() + 6);

  //   const startDate = startOfWeek;
  //   const endDate = endOfWeek;

  //   return {
  //     startDate,
  //     endDate,
  //   };
  // };

  const getStartDateAndEndDate = () => {
    const currentDate = new Date();

    // Calculate the end date (today)
    const endDay = new Date(currentDate);

    // Calculate the start date 7 days ago
    const startDay = new Date(currentDate);
    startDay.setDate(currentDate.getDate() - 6);

    return {
      startDate: startDay,
      endDate: endDay,
    };
  };

  const { startDate, endDate } = getStartDateAndEndDate();
  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate,
      endDate: endDate,
      key: "selection",
    },
  ]);

  const handleRangeFocusChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const dateRangeHandler = () => setOpen((prev) => !prev);

  const profitlossdifference = (invoices, expenses) => {
    const exampleprofitloss = [];
    invoices.map((value, index) => {
      exampleprofitloss[index] = value - expenses[index];
    });
    setprofitloss(exampleprofitloss);
  };

  const populateInvoices = async () => {
    const { data } = await getInvoices();
    setinvoices(data);
  };

  const populateExpenses = async () => {
    const { data } = await getExpenses();
    setexpenses(data);
  };

  const populateCurrentUser = async () => {
    const user = auth.getProfile();
    const { data } = await getUser(user._id);
    setCurrentUser(data);
  };

  useEffect(() => {
    profitlossdifference(invoices, expenses);
    populateCurrentUser();
    populateInvoices();
    populateExpenses();
  }, []);

  function generateDates(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);

    while (currentDate <= endDateObj) {
      dates.push(new Date(currentDate).toLocaleDateString());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  // Function to filter data based on date range
  function filterDataByDate(data, startDate, endDate) {
    return data.filter((entry) => {
      const entryDate = new Date(entry.paidDate).toLocaleDateString();
      const stDate = new Date(startDate).toLocaleDateString();
      const eDate = new Date(endDate).toLocaleDateString();

      return entryDate >= stDate && entryDate <= eDate;
    });
  }

  const selectedStartDate = dateRange[0].startDate;
  const selectedEndDate = dateRange[0].endDate;

  // filter income data by the date range
  const filteredInvoices = filterDataByDate(
    invoices,
    selectedStartDate,
    selectedEndDate
  );

  // filter expenses data by the date range
  const filteredExpenses = filterDataByDate(
    expenses,
    selectedStartDate,
    selectedEndDate
  );

  const incomeData = filteredInvoices.map((entry) => ({
    date: new Date(entry.paidDate).toLocaleDateString(),
    amount: entry.amount,
  }));

  const expensesData = filteredExpenses.map((entry) => ({
    date: new Date(entry.paidDate).toLocaleDateString(),
    amount: entry.amount,
  }));

  const labelsForChart = generateDates(selectedStartDate, selectedEndDate);

  const alignedIncomeData = [];
  labelsForChart.forEach((date) => {
    const incomesForDate = incomeData.filter((item) => item.date === date);

    if (incomesForDate.length > 0) {
      const totalIncomeForDate = incomesForDate.reduce(
        (total, income) => total + income.amount,
        0
      );
      alignedIncomeData.push(totalIncomeForDate);
    } else {
      alignedIncomeData.push(0);
    }
  });

  const alignedExpensesData = [];
  labelsForChart.forEach((date) => {
    const expenseForDate = expensesData.filter((item) => item.date === date);

    if (expenseForDate.length > 0) {
      const totalExpenseForDate = expenseForDate.reduce(
        (total, e) => total + e.amount,
        0
      );
      alignedExpensesData.push(totalExpenseForDate);
    } else {
      alignedExpensesData.push(0);
    }
  });

  const profitLossData = [];

  labelsForChart.forEach((date) => {
    const incomesForDate = incomeData.filter((item) => item.date === date);

    const expensesForDate = expensesData.filter((item) => item.date === date);

    const totalIncome = incomesForDate.reduce(
      (total, income) => total + income.amount,
      0
    );

    const totalExpenses = expensesForDate.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const profitLoss = totalIncome - totalExpenses;

    profitLossData.push(profitLoss);
  });

  const lineChart = {
    data: {
      labels: labelsForChart,
      datasets: [
        {
          label: "Income", // Unique label for Invoices dataset
          data: alignedIncomeData,
          fill: false,
          backgroundColor: "rgb(0,128,0)", // Green color
          borderColor: "rgb(0,128,0)",
        },
        {
          label: "Expenses", // Unique label for Expenses dataset
          data: alignedExpensesData,
          fill: false,
          backgroundColor: "rgb(255, 0, 0)", // Red color
          borderColor: "#FF474C",
        },
        {
          label: "Porfit-Loss", // Unique label for Expenses dataset
          data: profitLossData,
          fill: false,
          backgroundColor: "#0000FF",
          borderColor: "#0000FF",
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItem, data) {
              if (parseInt(tooltipItem[0].value) < 0) {
                return data.labels[tooltipItem[0].index] + "- Loss ";
              } else {
                return data.labels[tooltipItem[0].index] + "- Profit ";
              }
            },
            label: function (tooltipItem, data) {
              return (
                " " +
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              );
            },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
          },
        },
      },
    },
  };

  // const lineChart = {
  //   data: {
  //     labels: months,
  //     datasets: [
  //       {
  //         label: "Profit/Loss",
  //         data: profitloss,
  //         fill: false,
  //         backgroundColor: "rgb(255, 99, 132)",
  //         borderColor: "rgba(255, 99, 132, 0.2)",
  //       },
  //     ],
  //   },
  //   options: {
  //     tooltips: {
  //       callbacks: {
  //         title: function (tooltipItem, data) {
  //           if (parseInt(tooltipItem[0].value) < 0) {
  //             return data["labels"][tooltipItem[0]["index"]] + "- Loss ";
  //           } else {
  //             return data["labels"][tooltipItem[0]["index"]] + "- Profit ";
  //           }
  //         },
  //         label: function (tooltipItem, data) {
  //           return " " + data["datasets"][0]["data"][tooltipItem["index"]];
  //         },
  //       },
  //     },
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     scales: {
  //       yAxes: [
  //         {
  //           ticks: {
  //             beginAtZero: true,
  //           },
  //         },
  //       ],
  //     },
  //   },
  // };

  const barChart = {
    data: {
      labels: labelsForChart,
      datasets: [
        {
          label: "Income",
          borderWidth: 2,
          backgroundColor: "rgb(0,128,0)", // Green color
          borderColor: "rgb(0,128,0)",
          data: alignedIncomeData,
        },
        {
          label: "Expenses",
          borderWidth: 2,
          backgroundColor: "rgb(255, 0, 0)", // Red color
          borderColor: "rgb(255, 0, 0)",
          data: alignedExpensesData,
        },
      ],
    },
    options: {
      legend: false,
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            const datasetIndex = tooltipItem[0].datasetIndex;
            return data.datasets[datasetIndex].label;
          },
        },
      },
      // tooltips: {
      //   callbacks: {
      //     title: function (tooltipItem, data) {
      //       if (parseInt(tooltipItem[0].value) < 0) {
      //         return data["labels"][tooltipItem[0]["index"]] + "- Loss ";
      //       } else {
      //         return data["labels"][tooltipItem[0]["index"]] + "- Profit ";
      //       }
      //     },
      //     label: function (tooltipItem, data) {
      //       return " " + data["datasets"][0]["data"][tooltipItem["index"]];
      //     },
      //   },
      // },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  // const barChart = {
  //   data: {
  //     labels: months,
  //     datasets: [
  //       {
  //         label: "Profit/Loss",
  //         borderWidth: 2,
  //         backgroundColor: function (context) {
  //           var index = context.dataIndex;
  //           var value = context.dataset.data[index];
  //           return value < 0
  //             ? "rgba(255, 99, 132, 0.2)"
  //             : "rgba(54, 162, 235, 0.2)";
  //         },
  //         borderColor: function (context) {
  //           var index = context.dataIndex;
  //           var value = context.dataset.data[index];
  //           return value < 0
  //             ? "rgba(255, 99, 132, 0.2)"
  //             : "rgba(54, 162, 235, 0.2)";
  //         },
  //         data: profitloss,
  //       },
  //     ],
  //   },
  //   options: {
  //     legend: false,
  //     tooltips: {
  //       callbacks: {
  //         title: function (tooltipItem, data) {
  //           if (parseInt(tooltipItem[0].value) < 0) {
  //             return data["labels"][tooltipItem[0]["index"]] + "- Loss ";
  //           } else {
  //             return data["labels"][tooltipItem[0]["index"]] + "- Profit ";
  //           }
  //         },
  //         label: function (tooltipItem, data) {
  //           return " " + data["datasets"][0]["data"][tooltipItem["index"]];
  //         },
  //       },
  //     },
  //     responsive: true,
  //     maintainAspectRatio: false,
  //   },
  // };

  const radarChart = {
    data: {
      labels: labelsForChart,
      datasets: [
        {
          label: "Income",
          borderWidth: 2,
          backgroundColor: "rgb(0,128,0)", // Green color
          borderColor: "#90EE90",
          pointBackgroundColor: "#ff5b57",
          pointRadius: 2,
          data: alignedIncomeData,
        },
        {
          label: "Expenses",
          borderWidth: 2,
          backgroundColor: "rgb(255, 0, 0)", // Red color
          borderColor: "#FF474C",
          pointBackgroundColor: "#ff5b57",
          pointRadius: 2,
          data: alignedExpensesData,
        },
      ],
    },
    options: {
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            const datasetIndex = tooltipItem[0].datasetIndex;
            return data.datasets[datasetIndex].label;
          },
        },
      },
      // tooltips: {
      //   callbacks: {
      //     title: function (tooltipItem, data) {
      //       if (parseInt(tooltipItem[0].value) < 0) {
      //         return data["labels"][tooltipItem[0]["index"]] + "- Loss ";
      //       } else {
      //         return data["labels"][tooltipItem[0]["index"]] + "- Profit ";
      //       }
      //     },
      //     label: function (tooltipItem, data) {
      //       return " " + data["datasets"][0]["data"][tooltipItem["index"]];
      //     },
      //   },
      // },
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  const polarAreaChart = {
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [
            alignedIncomeData.reduce((sum, value) => sum + value, 0),
            alignedExpensesData.reduce((sum, value) => sum + value, 0)
          ],
          backgroundColor: [
            "rgba(0, 128, 0, 0.5)", // Green for Income
            "rgba(255, 0, 0, 0.5)", // Red for Expenses
          ],
          borderColor: [
            "rgb(0, 128, 0)",
            "rgb(255, 0, 0)",
          ],
          borderWidth: 1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: false,
            boxWidth: 40,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label;
              const value = context.raw;
              const startDate = new Date(dateRange[0].startDate).toLocaleDateString();
              const endDate = new Date(dateRange[0].endDate).toLocaleDateString();
              return [
                `${label}: ${value}`,
                `Date Range: ${startDate} to ${endDate}`
              ];
            }
          }
        }
      }
    }
  };

  const pieChart = {
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [
            alignedIncomeData.reduce((sum, value) => sum + value, 0),
            alignedExpensesData.reduce((sum, value) => sum + value, 0)
          ],
          backgroundColor: [
            "rgba(0, 128, 0, 0.5)", // Green for Income
            "rgba(255, 0, 0, 0.5)", // Red for Expenses
          ],
          borderColor: [
            "rgb(0, 128, 0)",
            "rgb(255, 0, 0)",
          ],
          borderWidth: 1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: false,
            boxWidth: 40,
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              const label = context.label;
              const value = context.raw;
              const dates = labelsForChart.join(", ");
              return [
                `${label}: ${value}`,
                `Dates: ${dates}`
              ];
            }
          }
        },
        datalabels: {
          color: '#000',
          anchor: 'end',
          align: 'end',
          offset: 10,
          font: {
            size: 12
          },
          formatter: function(value) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  const doughnutChart = {
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [
            alignedIncomeData.reduce((sum, value) => sum + value, 0),
            alignedExpensesData.reduce((sum, value) => sum + value, 0)
          ],
          backgroundColor: [
            "rgba(0, 128, 0, 0.5)", // Green for Income
            "rgba(255, 0, 0, 0.5)", // Red for Expenses
          ],
          borderColor: [
            "rgb(0, 128, 0)",
            "rgb(255, 0, 0)",
          ],
          borderWidth: 1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: false,
            boxWidth: 40,
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              const label = context.label;
              const value = context.raw;
              const dates = labelsForChart.join(", ");
              return [
                `${label}: ${value}`,
                `Dates: ${dates}`
              ];
            }
          }
        },
        datalabels: {
          color: '#000',
          anchor: 'end',
          align: 'end',
          offset: 10,
          font: {
            size: 12
          },
          formatter: function(value) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <div>
      <ol className="breadcrumb float-xl-right">
        <li className="breadcrumb-item">
          <Link to="/chart/js">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/chart/js">Chart</Link>
        </li>
        <li className="breadcrumb-item active">Chart JS</li>
      </ol>
      <h1 className="page-header">
        Profit Loss Chart of {currentUser?.accountNo?.companyInfo?.businessName}{" "}
      </h1>

      <button
        type="button"
        className="btn btn-light addList h-100 mb-4"
        onClick={dateRangeHandler}
      >
        <i className="fa fa-calendar fa-fw  ml-n1"></i>
        {new Date(selectedStartDate).toLocaleDateString()} to{" "}
        {new Date(selectedEndDate).toLocaleDateString()}
        <b className="caret"></b>
      </button>

      <Modal
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={open}
        onClose={dateRangeHandler}
        aria-labelledby="Date range picker"
      >
        <DateRangePicker
          ranges={dateRange}
          onChange={handleRangeFocusChange}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          staticRanges={staticRanges}
          direction="horizontal"
        />
      </Modal>
      <div className="row">
        <div className="col-xl-6">
          <Panel>
            <PanelHeader>Line Chart</PanelHeader>
            <PanelBody>
              <p>Porfit-Loss-chart</p>
              <div style={{ height: "300px" }}>
                <Line data={lineChart.data} options={lineChart.options} />
              </div>
            </PanelBody>
          </Panel>
        </div>
        <div className="col-xl-6">
          <Panel>
            <PanelHeader>Bar Chart</PanelHeader>
            <PanelBody>
              <p>Porfit-Loss-chart</p>
              <div style={{ height: "300px" }}>
                <Bar data={barChart.data} options={barChart.options} />
              </div>
            </PanelBody>
          </Panel>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6">
          <Panel>
            <PanelHeader>Radar Chart</PanelHeader>
            <PanelBody>
              <p>Porfit-Loss-chart</p>
              <div style={{ height: "300px" }}>
                <Radar data={radarChart.data} options={radarChart.options} />
              </div>
            </PanelBody>
          </Panel>
        </div>
        <div className="col-xl-6">
          <Panel>
            <PanelHeader>Polar Area Chart</PanelHeader>
            <PanelBody>
              <p>Porfit-Loss-chart</p>
              <div style={{ height: "300px" }}>
                <PolarArea
                  data={polarAreaChart.data}
                  options={polarAreaChart.options}
                />
              </div>
            </PanelBody>
          </Panel>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Panel>
            <PanelHeader>Pie Chart</PanelHeader>
            <PanelBody>
              <p>Porfit-Loss-chart</p>
              <div style={{ height: "300px" }}>
                <Pie data={pieChart.data} options={pieChart.options} />
              </div>
            </PanelBody>
          </Panel>
        </div>
        <div className="col-md-6">
          <Panel>
            <PanelHeader>Doughnut Chart</PanelHeader>
            <PanelBody>
              <p>Porfit-Loss-chart</p>
              <div style={{ height: "300px" }}>
                
                <Doughnut
                  data={doughnutChart.data}
                  options={doughnutChart.options}
                />
              </div>
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default ChartBiz;
