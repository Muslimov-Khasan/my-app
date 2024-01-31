import Nav from "../Nav/Nav";
import "./Monitoring.css";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardBody } from "@material-tailwind/react";
import Chart from "react-apexcharts";

import { useState, useEffect } from "react";

ChartJS.register(
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Monitoring() {
  const [selectedOption, setSelectedOption] = useState("DAILY");
  const [ChooseDate, setChooseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [xData, setxData] = useState([]);
  const [yData, setyData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedOption, ChooseDate]); // Run fetchData when selectedOption changes

  const handleSelectChange = async (event) => {
    try {
      setSelectedOption(event.target.value);
      await fetchData();
    } catch (error) {
      console.error("Error handling select change:", error);
    }
  };

  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
  
      const response = await fetch(
        "https://avtowatt.uz/api/v1/products/statistics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            date: ChooseDate,
            key: selectedOption,
          }),
        }
      );
  
      const responseData = await response.json();
      const tempxData = responseData.map((item) => item.dateInterval);
      const tempyData = responseData.map((item) => item.productCount);
  
      setxData([...tempxData]);
      setyData([...tempyData]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const chartConfig = {
    type: "bar", // Change the chart type to "bar" for a column chart
    width: "100%",
    height: 500,
    series: [
      {
        name: "Sales",
        data: yData,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#25B679"],
      plotOptions: {
        bar: {
          columnWidth: "70%", // Adjust the column width as needed
          endingShape: "rounded", // You can change this to "flat" if you prefer flat columns
        },
      },
      xaxis: {
        categories: xData,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <>
      <div className="container">
        <Nav />

        <div className="drmamma-wrapper">
          <div className="text-wrapper">
            <h2 className="drmamma-title">Monitoring</h2>
            <p className="drmamma-title">E’lonlar</p>
          </div>
          <select
            className="day-select"
            onChange={handleSelectChange}
            value={selectedOption}
          >
            <option className="option" value="DAILY">
              Day
            </option>
            <option className="option" value="MONTHLY">
              Month
            </option>
            <option className="option" value="YEARLY">
              Year
            </option>
          </select>
          <input
            className="date-input"
            type="date"
            onChange={(event) => setChooseDate(event.target.value)}
            value={ChooseDate}
          />
        </div>
      <div className="card">

        <Card>
          <CardBody className="w-full px-2 pb-0">
            <Chart {...chartConfig} />
          </CardBody>
        </Card>
      </div>
      </div>
    </>
  );
}

export default Monitoring;