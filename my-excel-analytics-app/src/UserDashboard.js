import React, { useEffect, useState, useCallback, useContext } from "react";
import Plotly from "react-plotly.js";
import { Typed } from "react-typed";
import {
  FaChartLine,
  FaTable,
  FaUser,
  FaSignOutAlt,
  FaUpload,
  FaDownload,
  FaRobot,
  FaPlusCircle,
  FaChevronDown,
  FaInfoCircle,
  FaSun,
  FaMoon,
  FaChartPie,
  FaChartBar,
  FaCube,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import clsx from "clsx";
import { DarkModeContext } from "./contexts/DarkModeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api";

  const [activeTab, setActiveTab] = useState("analytics");
  const [user, setUser] = useState({ fullname: "", email: "", role: "" });
  const [excelData, setExcelData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [xAxis, setXAxis] = useState([]);
  const [yAxis, setYAxis] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [loadingFromHistory, setLoadingFromHistory] = useState(false);
  const [fileHistory, setFileHistory] = useState([]);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 0,
    recentViews: 0,
    lastActive: "Never",
  });
  const [aiInsight, setAiInsight] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Use the global context
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchUserDataAndFiles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        setLoading(true);
        const [userRes, filesRes] = await Promise.all([
          fetch(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/files`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!userRes.ok) throw new Error("Failed to fetch user data.");
        if (!filesRes.ok) throw new Error("Failed to fetch files.");

        const userData = await userRes.json();
        const filesData = await filesRes.json();
        setUser(userData);
        setFileHistory(filesData);
        setDashboardStats({
          totalProjects: filesData.length,
          recentViews: filesData.reduce(
            (acc, file) => acc + (file.analyses?.length || 0),
            0
          ),
          lastActive:
            filesData.length > 0
              ? new Date(filesData[0].uploadDate).toLocaleDateString()
              : "Never",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDataAndFiles();
  }, [navigate]);

  // Track uploaded excel headers
useEffect(() => {
  if (excelData?.length) {
    const headers = Object.keys(excelData[0]);
    setColumnHeaders(headers);

    // X-axis default: first column
    setXAxis(headers.length > 0 ? [headers[0]] : []);

    // ✅ Only auto-select all Y-axis if NOT loading from history
    if (!loadingFromHistory) {
      setYAxis(headers.length > 1 ? headers.slice(1) : []);
    }

    setIsFileUploaded(true);
    setLoadingFromHistory(false); // reset after load
  } else {
    setColumnHeaders([]);
    setXAxis("");
    setYAxis([]);
    setIsFileUploaded(false);
  }
}, [excelData, loadingFromHistory]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const loadFileFromHistory = async (fileId, fileName) => {
    setLoading(true);
    setError("");
    setChartData(null);
    setAiInsight("");
    setExcelData(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to load file.");
      setExcelData(result.data);
      setUploadedFileName(fileName);
      setCurrentFileId(fileId);
      setIsFileUploaded(true);
      setActiveTab("analytics");
      setIsReportsDropdownOpen(false);

      // Scroll to the analytics section after tab activation
      setTimeout(() => {
        const element = document.getElementById("analytics-file-loaded-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setError("");
    setAiInsight("");
    setUploadedFileName("");
    setIsFileUploaded(false);
    setExcelData(null);
    setChartData(null);

    const formData = new FormData();
    formData.append("excelFile", file);
    const token = localStorage.getItem("token");

    try {
      const uploadRes = await fetch(`${API_URL}/files/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(result.error || "File upload failed.");
      const { fileId, data } = result;
      setExcelData(data);
      setCurrentFileId(fileId);
      setUploadedFileName(file.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const generateChart = useCallback(async () => {
  if (!excelData || !xAxis || yAxis.length === 0) {
    setError("Please upload a file and select both X and Y axes.");
    setChartData(null);
    return;
  }

  setLoading(true);
  setError("");

  // ✅ Always use first selected X-axis value from state
  const labels = excelData.map(row => row[xAxis[0]]);

  // Chart creation logic
  if (chartType === "pie") {
    if (yAxis.length > 1) {
      setError("Pie charts can only be generated with a single Y-axis. Please select only one.");
      setChartData(null);
      setLoading(false);
      return;
    }

    const values = excelData.map(row => parseFloat(row[yAxis[0]]));
    const newChartData = {
      labels,
      datasets: [
        {
          label: yAxis[0], // ✅ Always take single label
          data: values,
          backgroundColor: labels.map(() =>
            `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
              Math.random() * 255
            )}, ${Math.floor(Math.random() * 255)}, 0.5)`
          ),
          borderColor: "rgba(255, 255, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
    setChartData(newChartData);

  } else if (chartType === "3d") {
    if (yAxis.length < 2) {
      setError("3D charts require at least two Y-axes. Please select two or more.");
      setChartData(null);
      setLoading(false);
      return;
    }

    const trace = {
      type: "scatter3d",
      mode: "lines+markers",
      x: labels,
      y: excelData.map(row => parseFloat(row[yAxis[0]])),
      z: excelData.map(row => parseFloat(row[yAxis[1]])),
      marker: { size: 4 },
      line: { width: 2 },
    };
    setChartData([trace]);

  } else {
    // ✅ Only use selected Y-axis values from state
    const datasets = yAxis.map((col, index) => ({
      label: col,
      data: excelData.map(row => parseFloat(row[col])),
      backgroundColor: `rgba(${53 + index * 50}, ${162 + index * 10}, ${
        235 - index * 15
      }, 0.5)`,
      borderColor: `rgba(${53 + index * 50}, ${162 + index * 10}, ${
        235 - index * 15
      }, 1)`,
      borderWidth: 1,
    }));
    setChartData({ labels, datasets });
  }

  // ✅ Save analysis + refresh file history
  if (currentFileId) {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/files/${currentFileId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chartType,
          xAxis: Array.isArray(xAxis) ? xAxis[0] : xAxis, // single value
          yAxis: [...yAxis], // exact selection
        }),
      });

      // Refresh history immediately
      const filesRes = await fetch(`${API_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedFiles = await filesRes.json();
      setFileHistory(updatedFiles);
    } catch (err) {
      console.error("Failed to save analysis to backend:", err);
    }
  }

  setLoading(false);

  // Scroll to chart display
  setTimeout(() => {
    const element = document.getElementById("data-visualization-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 150);
}, [excelData, xAxis, yAxis, chartType, currentFileId, API_URL]);

useEffect(() => {
  if (loadingFromHistory && xAxis.length > 0 && yAxis.length > 0) {
    generateChart(); // uses latest states
    const chartSection = document.getElementById("data-visualization-section");
    if (chartSection) {
      chartSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setLoadingFromHistory(false);
  }
}, [loadingFromHistory, xAxis, yAxis, generateChart]);


  const handleGetAiInsight = async () => {
    if (!excelData || !xAxis || yAxis.length === 0) {
      alert("Please upload a file and select axes to get AI insights.");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      setAiInsight(
        "AI analysis suggests a strong correlation between the selected axes, with a notable increase in values over time. Further analysis could explore seasonality."
      );
      setLoading(false);
    }, 2000);
  };

  const handleDownloadChart = () => {
    const canvas = document.getElementById("chart-canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `chart-${new Date().getTime()}.png`;
      link.click();
    }
  };

const renderChart = () => {
  // Define theme colors using CSS variables for easy dark/light support
  const containerStyle = { background: 'var(--color-bg)' };
  const subtleText = { color: 'var(--color-subtle)' };
  const errorText = { color: 'var(--color-error)' };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full" style={containerStyle}>
        <p className="animate-pulse" style={subtleText}>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-full" style={containerStyle}>
        <p style={errorText}>{error}</p>
      </div>
    );
  if (!chartData)
    return (
      <div className="flex items-center justify-center h-full" style={containerStyle}>
        <p style={subtleText}>
          Upload data and generate a chart to see it here.
        </p>
      </div>
    );

    // Dynamic colors for dark/light theme
  const axisColor = isDarkMode ? "#ffffff" : "#000000";
  const gridColor = isDarkMode ? "#444444" : "#cccccc";
  const bgColor   = isDarkMode ? "#1f2937" : "#ffffff"; // Tailwind gray-900 for dark bg

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: axisColor, // legend text color
        },
      },
      title: {
        display: true,
        text: `Chart of ${yAxis.join(", ")} vs ${xAxis}`,
        color: axisColor, // title color
      },
    },
    scales: {
      x: {
        ticks: { color: axisColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: axisColor },
        grid: { color: gridColor },
      },
    },
    maintainAspectRatio: false,
    backgroundColor: bgColor,
  };


  if (chartType === "3d") {
    return (
      <Plotly
        data={chartData}
        layout={{
          margin: { l: 0, r: 0, b: 0, t: 40 },
          paper_bgcolor: "var(--color-bg)",
          plot_bgcolor: "var(--color-bg)",
          font: { color: "var(--color-fg)" },
          title: {
            text: `3D Chart of ${yAxis[0] || ""} vs ${xAxis || ""} vs ${yAxis || ""}`,
            font: { color: "var(--color-fg)" },
          },
        }}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }

  switch (chartType) {
    case "line":
      return <Line data={chartData} options={options} id="chart-canvas" />;
    case "bar":
      return <Bar data={chartData} options={options} id="chart-canvas" />;
    case "pie":
      return (
        <Pie
          data={chartData}
          options={{
            ...options,
            plugins: {
              ...options.plugins,
              title: {
                ...options.plugins.title,
                text: `Chart of ${yAxis[0]} vs ${xAxis}`,
              },
            },
          }}
          id="chart-canvas"
        />
      );
    default:
      return <p>Select a chart type.</p>;
  }
};


const renderContent = () => {
  switch (activeTab) {
    case "analytics":
      return (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-500 dark:text-gray-300 font-medium">Total Projects</h2>
              <p className="text-4xl font-bold mt-2 text-green-600 dark:text-green-400">
                {dashboardStats.totalProjects}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-500 dark:text-gray-300 font-medium">Recent Views</h2>
              <p className="text-4xl font-bold mt-2 text-green-600 dark:text-green-400">
                {dashboardStats.recentViews}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h2 className="text-gray-500 dark:text-gray-300 font-medium">Last Active</h2>
              <p className="text-xl font-bold mt-2 text-green-600 dark:text-green-400">
                {dashboardStats.lastActive}
              </p>
            </div>
          </div>

          {/* Upload + Config */}
          <div
            id="analytics-file-loaded-section"  // Add this ID to enable scrollIntoView targeting
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center space-x-2">
              <span>New Analysis</span>
              <div className="relative group">
                <FaInfoCircle className="text-green-500 dark:text-green-400 hover:text-green-600 cursor-pointer transition-colors" />
                <span className="absolute left-1/2 -top-10 -translate-x-1/2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  To generate a chart, first upload an Excel file, then select your desired X and Y axes, and finally choose a chart type (for 3D chart you have to choose two Y axes using ctrl+ then select).
                </span>
              </div>
            </h2>

            <label className="flex flex-col items-center justify-center space-y-4 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <FaUpload className="text-green-500 text-4xl" />
              <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Drag and drop your Excel file here or{" "}
                <span className="text-green-500 underline">click to upload</span>
              </span>
              <p className="text-sm text-gray-400 dark:text-gray-500">Supported formats: .xls, .xlsx</p>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".xls,.xlsx"
                className="hidden"
              />
            </label>

            {uploadedFileName && (
              <p className="mt-4 text-center text-sm text-green-600 dark:text-green-400 font-semibold">
                File loaded: <span className="font-mono">{uploadedFileName}</span>
              </p>
            )}

            {isFileUploaded && (
              <>
                {/* Axis & Chart Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      X-Axis
                    </label>
                    <select
                      multiple
                      value={xAxis}
                      onChange={(e) =>
                        setXAxis(
                          Array.from(e.target.selectedOptions, (option) => option.value)
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm h-32 p-2 bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 dark:text-gray-100"
                    >
                      {columnHeaders.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Y-Axis
                    </label>
                    <select
                      multiple
                      value={yAxis}
                      onChange={(e) =>
                        setYAxis(
                          Array.from(e.target.selectedOptions, (option) => option.value)
                        )
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm h-32 p-2 bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 dark:text-gray-100"
                    >
                      {columnHeaders.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Chart Type
                    </label>
                    <select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm p-2 bg-gray-50 dark:bg-gray-700 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 dark:text-gray-100"
                    >
                      <option value="line">Line Chart (2D)</option>
                      <option value="bar">Bar Chart (2D)</option>
                      <option value="pie">Pie Chart (2D)</option>
                      <option value="3d">3D Chart (X, Y, Z)</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                  <button
  onClick={generateChart}
  disabled={!excelData?.length || xAxis === "" || yAxis.length === 0}
  className={`flex-1 p-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center space-x-2 ${
    !excelData?.length || xAxis === "" || yAxis.length === 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  <FaChartLine />
  <span>Generate Chart</span>
</button>

                  <button
                    onClick={handleGetAiInsight}
                    className="flex-1 p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all flex items-center justify-center space-x-2"
                  >
                    <FaRobot />
                    <span>Get AI Insights</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Chart Display */}
          <div id="data-visualization-section" className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 relative min-h-[400px] scroll-mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Your Data Visualization
            </h2>
            <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center p-4">
              {renderChart()}
            </div>
            {chartData && (
              <button
                onClick={handleDownloadChart}
                className="absolute bottom-8 right-8 p-3 bg-gray-800 dark:bg-white dark:text-black text-white rounded-full hover:bg-gray-900 dark:hover:bg-gray-300 transition-colors shadow-lg"
              >
                <FaDownload />
              </button>
            )}
          </div>

          {/* AI Insights */}
          {aiInsight && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mt-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                AI-Powered Insights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{aiInsight}</p>
            </div>
          )}
        </>
      );

    case "reports":
      return (
        <>
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            My Reports
          </h1>
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading reports...</p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
          ) : fileHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              You have no reports yet. Upload a file to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fileHistory.map((file) => (
                <div
                  key={file._id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:shadow-lg hover:border-green-500"
                >
                  <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                    {file.fileName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b pb-2 mb-2">
                      Analysis History
                    </h4>
                    {file.analyses?.length === 0 ? (
                      <p className="text-gray-400 dark:text-gray-500 text-sm">
                        No analysis performed yet.
                      </p>
                    ) : (
                    <ul className="space-y-3">
  {[...(file.analyses || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 🆕 Sort newest first
    .map((analysis, index) => {
      let ChartIcon, typeColor;
      switch (analysis.chartType) {
        case "line":
          ChartIcon = FaChartLine;
          typeColor = "text-blue-500";
          break;
        case "bar":
          ChartIcon = FaChartBar;
          typeColor = "text-yellow-500";
          break;
        case "pie":
          ChartIcon = FaChartPie;
          typeColor = "text-purple-500";
          break;
        case "3d":
          ChartIcon = FaCube;
          typeColor = "text-pink-500";
          break;
        default:
          ChartIcon = FaChartLine;
          typeColor = "text-gray-500";
      }

      return (
        <li
          key={index}
         onClick={async () => {
  setLoadingFromHistory(true);
  await loadFileFromHistory(file.fileId, file.fileName);
  setActiveTab("analytics");
  setChartType(analysis.chartType);
  setXAxis([analysis.xAxis]);
  setYAxis([...analysis.yAxis]); // exact from history
}}

          className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
        >
          <ChartIcon className={`mt-1 ${typeColor}`} size={18} />
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {analysis.chartType.charAt(0).toUpperCase() + analysis.chartType.slice(1)} Chart
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              X: <span className="font-mono">{analysis.xAxis}</span> &nbsp;|&nbsp;
              Y: <span className="font-mono">{analysis.yAxis.join(", ")}</span>
            </p>
            {analysis.createdAt && (
              <p className="text-xs text-gray-400 mt-1">
                {new Date(analysis.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        </li>
      );
    })}
</ul>


                    )}
                  </div>
                  <button
                    onClick={() => loadFileFromHistory(file.fileId, file.fileName)}
                    className="mt-6 w-full py-2 px-4 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium text-center"
                  >
                    View Report
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      );

    case "profile":
      return (
        <>
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            User Profile
          </h1>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-lg">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 text-3xl font-bold">
                {user.fullname ? user.fullname.charAt(0) : "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {user.fullname}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Email</h3>
                <p className="text-gray-900 dark:text-gray-100 mt-1">{user.email}</p>
              </div>
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
};



 return (
  <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    {/* {Sidebar} */}
  <motion.aside
  animate={{ width: 280 }}
  transition={{ duration: 0.3 }}
  className="bg-green-50 dark:bg-green-900 p-6 flex flex-col shadow-xl border-r border-green-200 dark:border-green-800 overflow-hidden transition-all duration-500"
>
  {/* Logo Section */}
  <div className="mb-12 text-center">
  <div className="text-green-600 dark:text-green-300 transition-transform duration-300 mx-auto cursor-pointer flex justify-center items-center">
    <FaChartPie size={40} />
  </div>
  <p className="text-2xl font-bold mt-2 tracking-wide text-green-800 dark:text-green-100">
    Sheet <span className="text-green-600 dark:text-green-400">Insights</span>
  </p>
</div>


  {/* Navigation */}
  <nav className="space-y-3">
    {/* My Analytics */}
    <button
      onClick={() => setActiveTab("analytics")}
      className={`w-full p-3 rounded-md font-medium tracking-wide flex items-center
        ${activeTab === "analytics"
          ? "bg-green-500 text-white shadow-lg scale-105"
          : "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 hover:bg-green-400 hover:text-white"
        } transition-all duration-300 ease-in-out`}
    >
      <FaChartLine className="mr-3" /> My Analytics
    </button>

    {/* My Reports */}
    <div>
      <button
        onClick={() => setIsReportsDropdownOpen(!isReportsDropdownOpen)}
        className={`w-full p-3 rounded-md font-medium tracking-wide flex items-center
          ${activeTab === "reports"
            ? "bg-green-500 text-white shadow-lg scale-105"
            : "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 hover:bg-green-400 hover:text-white"
          } transition-all duration-300 ease-in-out`}
      >
        <FaTable className="mr-3" /> My Reports
        <FaChevronDown
          className={`ml-auto transition-transform ${isReportsDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isReportsDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 ml-4 rounded-md shadow-lg bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-700"
        >
          <div className="py-2">
            <div className="px-4 py-1 text-xs text-green-700 dark:text-green-200">
              Recent Files
            </div>
            {fileHistory.length > 0 ? (
              fileHistory.slice(0, 5).map((file) => (
                <button
                  key={file._id}
                  onClick={() => loadFileFromHistory(file.fileId, file.fileName)}
                  className="block w-full text-left px-4 py-1 text-sm hover:bg-green-100 dark:hover:bg-green-700 truncate"
                >
                  {file.fileName}
                </button>
              ))
            ) : (
              <p className="px-4 py-1 text-sm text-green-500 dark:text-green-300">No files yet.</p>
            )}
            <div className="border-t border-green-200 dark:border-green-700 my-1"></div>
            <button
              onClick={() => setActiveTab("reports")}
              className="flex px-4 py-1 text-sm text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-700 w-full"
            >
              <FaPlusCircle className="mr-2" /> View All Reports
            </button>
          </div>
        </motion.div>
      )}
    </div>

    {/* Profile */}
    <button
      onClick={() => setActiveTab("profile")}
      className={`w-full p-3 rounded-md font-medium tracking-wide flex items-center
        ${activeTab === "profile"
          ? "bg-green-500 text-white shadow-lg scale-105"
          : "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 hover:bg-green-400 hover:text-white"
        } transition-all duration-300 ease-in-out`}
    >
      <FaUser className="mr-3" /> Profile
    </button>
  </nav>

  {/* Logout */}
  <div className="mt-auto pt-6">
    <button
      onClick={handleLogout}
      className="flex items-center justify-center p-3 bg-red-500 w-full rounded-md 
        font-medium transition-all text-white duration-300 ease-in-out transform
        hover:bg-red-600 hover:scale-105 hover:shadow-lg"
    >
      <FaSignOutAlt className="mr-2" /> Logout
    </button>
  </div>
</motion.aside>



    {/* Main Content */}
    <main className="flex-1 p-10 overflow-y-auto bg-gray-50 dark:bg-gray-900 -mt-5">
      <header className="mb-10 pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          <span className="inline-block overflow-hidden whitespace-nowrap animate-typing">
            Welcome,{" "}
            <span className="text-green-500">{user.fullname || "User"}</span>!
          </span>
        </h1>

        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full shadow-lg transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {isDarkMode ? (
            <FaSun className="h-6 w-6" />
          ) : (
            <FaMoon className="h-6 w-6" />
          )}
        </button>
      </header>

      {renderContent()}
    </main>
  </div>
);

};

export default UserDashboard;
