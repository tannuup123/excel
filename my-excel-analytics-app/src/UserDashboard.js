import { useAuth } from './contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import PlotlyComponent from "react-plotly.js";
import Plotly from 'plotly.js-dist-min';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import Profile from './Profile';
import {
  FaChartLine, FaTable, FaUser, FaSignOutAlt, FaUpload, FaRobot, FaInfoCircle,
  FaSun, FaMoon, FaChartPie, FaFilePdf, FaFileImage, FaSearch, FaTimes,
  FaCheckCircle, FaExclamationTriangle
} from "react-icons/fa";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { DarkModeContext } from "./contexts/DarkModeContext";

const CustomAlert = ({ message, onClose, isSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4 font-sans">
      <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-sm w-full text-center p-6 transition-all duration-300 transform scale-100 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <div className={`flex items-center space-x-3 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {isSuccess ? <FaCheckCircle size={24} /> : <FaExclamationTriangle size={24} />}
            <p className="text-2xl font-bold text-white">{isSuccess ? "Success" : "Error"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={20} />
          </button>
        </div>
        <p className="text-gray-200 text-lg mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full text-white font-bold py-3 rounded-lg transition-all duration-300 border-2 ${isSuccess ? 'bg-green-500/30 hover:bg-green-500/50 border-green-400/50' : 'bg-red-500/30 hover:bg-red-500/50 border-red-400/50'} focus:ring-4 ${isSuccess ? 'focus:ring-green-300/50' : 'focus:ring-red-300/50'}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
);

const parseNumericValue = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return NaN;
  const cleanedValue = value.replace(/[^0-9.-]+/g, "");
  if (cleanedValue === "") return NaN;
  return parseFloat(cleanedValue);
};

const CustomSelector = ({ options, selectedValue, onChange, isMultiSelect = false }) => {
  const handleClick = (optionValue) => {
    if (isMultiSelect) {
      const currentSelection = selectedValue || [];
      const newSelection = currentSelection.includes(optionValue)
        ? currentSelection.filter(item => item !== optionValue)
        : [...currentSelection, optionValue];
      onChange(newSelection);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div className="w-full h-40 p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-y-auto">
      <ul className="space-y-1">
        {options.map(option => {
          const isSelected = isMultiSelect
            ? (selectedValue || []).includes(option.value)
            : selectedValue === option.value;

          return (
            <li
              key={option.value}
              onClick={() => handleClick(option.value)}
              className={`p-2 rounded-md cursor-pointer text-sm transition-colors ${isSelected
                ? 'bg-gray-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const generateDynamicInsight = (data, xAxis, yAxis, chartType) => {
    if (!data || data.length === 0 || !xAxis || !yAxis || yAxis.length === 0) {
        return "Insight generation requires data and selected axes.";
    }
    const insights = [];
    const dataPointsCount = data.length;
    insights.push(`This ${chartType} chart visualizes ${yAxis.join(' & ')} against ${xAxis} across ${dataPointsCount} data points.`);
    const primaryYColumn = yAxis[0];
    const numericValues = data.map(row => parseNumericValue(row[primaryYColumn])).filter(v => !isNaN(v));
    if (numericValues.length > 0) {
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const avg = sum / numericValues.length;
        const max = Math.max(...numericValues);
        const min = Math.min(...numericValues);
        insights.push(`For '${primaryYColumn}', the values range from ${min.toFixed(2)} to ${max.toFixed(2)}. The average value is ${avg.toFixed(2)}.`);
        const maxRow = data.find(row => parseNumericValue(row[primaryYColumn]) === max);
        if(maxRow) {
            insights.push(`The peak value of ${max.toFixed(2)} is associated with '${maxRow[xAxis]}' on the X-axis.`);
        }
    } else {
        insights.push(`The primary Y-axis column '${primaryYColumn}' contains no valid numeric data for analysis.`);
    }
    return insights.join(' ');
};


const UserDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000/api";
  const plotlyRef = useRef(null);

  const [activeTab, setActiveTab] = useState("analytics");
  const [user, setUser] = useState({ fullname: "", email: "", role: "" });
  const [excelData, setExcelData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [fileHistory, setFileHistory] = useState([]);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({ totalProjects: 0, recentViews: 0, lastActive: "Never" });
  const [aiInsight, setAiInsight] = useState("");
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [viewingReport, setViewingReport] = useState(null);

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
        setAlert({ show: true, message: err.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchUserDataAndFiles();
  }, [navigate]);

  useEffect(() => {
    if (excelData && excelData.length > 0) {
      const headers = Object.keys(excelData[0]);
      setColumnHeaders(headers);
      setXAxis(headers[0] || "");
      setYAxis(headers.length > 1 ? [headers[1]] : []);
      setIsFileUploaded(true);
    } else {
      setColumnHeaders([]);
      setXAxis("");
      setYAxis([]);
      setIsFileUploaded(false);
    }
  }, [excelData]);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    setChartData(null);
    setAiInsight("");
  }, [chartType, xAxis, yAxis]);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const loadFileFromHistory = (fileId) => {
    const reportToView = fileHistory.find(file => file.fileId === fileId);
    if (reportToView) {
      setViewingReport(reportToView);
    } else {
      setAlert({ show: true, message: 'Could not find the selected report.', type: 'error' });
    }
  };

  const handleFileUpload = async (event) => {
    setAlert({ show: false, message: '', type: '' });
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
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

      if (!uploadRes.ok) {
        const errorResult = await uploadRes.json();
        throw new Error(errorResult.error || "File upload failed.");
      }

      const result = await uploadRes.json();
      if (!result.data || result.data.length === 0) {
        throw new Error("File is empty or could not be read. Please check the file and try again.");
      }
      const { fileId, data } = result;
      setExcelData(data);
      setCurrentFileId(fileId);
      setUploadedFileName(file.name);
      setAlert({ show: true, message: "File uploaded successfully!", type: 'success' });
    } catch (err) {
      setAlert({ show: true, message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateChart = useCallback(() => {
    if (!excelData || !xAxis || yAxis.length === 0) {
      setAlert({ show: true, message: "Please upload a file and select both X and Y axes.", type: 'error' });
      return;
    }
    setLoading(true);
    setAlert({ show: false, message: '', type: '' });
    setChartData(null);
    setAiInsight("");

    setTimeout(() => {
      const labels = excelData.map((row) => row[xAxis]);
      const CHART_COLORS = [
        'rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)'
      ];
      const CHART_BORDER_COLORS = [
        'rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)',
        'rgb(255, 206, 86)', 'rgb(153, 102, 255)', 'rgb(255, 159, 64)'
      ];

      if (chartType === "pie") {
        if (yAxis.length > 1) {
          setAlert({ show: true, message: "Pie charts support only one Y-axis.", type: 'error' });
          setChartData(null);
          setLoading(false);
          return;
        }
        const values = excelData.map((row) => parseNumericValue(row[yAxis[0]]));
        const newChartData = {
          labels,
          datasets: [{
            label: yAxis[0],
            data: values,
            backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
            borderColor: "rgba(255, 255, 255, 0.8)",
            borderWidth: 2,
          }],
        };
        setChartData(newChartData);
      } else if (chartType === "3d") {
        if (yAxis.length < 2) {
          setAlert({ show: true, message: "3D charts require at least two Y-axes.", type: 'error' });
          setChartData(null);
          setLoading(false);
          return;
        }
        const trace = {
          type: "scatter3d", mode: "lines+markers", x: labels,
          y: excelData.map((row) => parseNumericValue(row[yAxis[0]])),
          z: excelData.map((row) => parseNumericValue(row[yAxis[1]])),
          marker: { size: 5, color: '#10B981' },
          line: { width: 3, color: '#059669' },
        };
        setChartData([trace]);
      } else {
        const datasets = yAxis.map((col, index) => ({
          label: col,
          data: excelData.map((row) => parseNumericValue(row[col])),
          backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
          borderColor: CHART_BORDER_COLORS[index % CHART_BORDER_COLORS.length],
          borderWidth: 2, tension: 0.4, fill: chartType === 'line',
        }));
        setChartData({ labels, datasets });
      }

      if (currentFileId) {
        const token = localStorage.getItem("token");
        fetch(`${API_URL}/files/${currentFileId}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ chartType, xAxis, yAxis }),
        }).catch((err) => console.error("Failed to save analysis:", err));
      }

      setLoading(false);
    }, 50);

  }, [excelData, xAxis, yAxis, chartType, API_URL, currentFileId]);

  const handleGetAiInsight = () => {
    if (!chartData) {
      setAlert({ show: true, message: "Please generate a chart first to get AI insights.", type: 'error' });
      return;
    }
    setLoading(true);
    setAiInsight('');
    const insight = generateDynamicInsight(excelData, xAxis, yAxis, chartType);
    setTimeout(() => {
      setAiInsight(insight);
      setLoading(false);
    }, 1000);
  };

  const handleDownload = async (format) => {
    let imageDataUrl;
    try {
      if (chartType === '3d') {
        if (plotlyRef.current) {
          imageDataUrl = await Plotly.toImage(plotlyRef.current.el, { format: 'png', width: 1200, height: 800 });
        }
      } else {
        const canvas = document.getElementById("chart-canvas");
        if (canvas) {
          imageDataUrl = canvas.toDataURL("image/png");
        }
      }

      if (!imageDataUrl) {
        throw new Error('Could not capture chart image. Please generate a chart first.');
      }

      const fileName = `${uploadedFileName || 'chart'}-${new Date().getTime()}`;

      if (format === 'png') {
        const link = document.createElement("a");
        link.href = imageDataUrl;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'pdf') {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
        const imgProps = pdf.getImageProperties(imageDataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imageDataUrl, 'PNG', 15, 15, pdfWidth - 30, pdfHeight - 30);
        pdf.save(`${fileName}.pdf`);
      }
      setAlert({ show: true, message: `Chart downloaded as ${format.toUpperCase()}`, type: 'success' });
    } catch (err) {
      setAlert({ show: true, message: err.message, type: 'error' });
    }
  };

  const generateChartImage = (analysis, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { chartType, xAxis, yAxis } = analysis;
        const labels = data.map(row => row[xAxis]);

        if (['line', 'bar', 'pie'].includes(chartType)) {
          const canvas = document.createElement('canvas');
          canvas.width = 1000;
          canvas.height = 500;

          const CHART_COLORS = [
            'rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)'
          ];

          let chartConfig;
          if (chartType === 'pie') {
            const values = data.map((row) => parseNumericValue(row[yAxis[0]]));
            chartConfig = {
              type: 'pie',
              data: {
                labels,
                datasets: [{ label: yAxis[0], data: values, backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]) }],
              },
            };
          } else {
            const datasets = yAxis.map((col, index) => ({
              label: col, data: data.map((row) => parseNumericValue(row[col])),
              backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              borderColor: CHART_COLORS[index % CHART_COLORS.length], borderWidth: 2,
            }));
            chartConfig = { type: chartType, data: { labels, datasets }, };
          }

          chartConfig.options = {
            responsive: false,
            animation: {
              onComplete: () => {
                const dataUrl = chart.canvas.toDataURL('image/png');
                chart.destroy();
                if (dataUrl && dataUrl !== 'data:,') {
                  resolve(dataUrl);
                } else {
                  reject(new Error('Generated a blank chart image for: ' + chartType));
                }
              }
            }
          };
          const chart = new ChartJS(canvas.getContext('2d'), chartConfig);
        }
        else if (chartType === '3d') {
          const hiddenDiv = document.createElement('div');
          hiddenDiv.style.visibility = 'hidden';
          hiddenDiv.style.width = '1000px'; hiddenDiv.style.height = '500px';
          document.body.appendChild(hiddenDiv);

          const trace = {
            type: "scatter3d", mode: "lines+markers", x: labels,
            y: data.map((row) => parseNumericValue(row[yAxis[0]])),
            z: data.map((row) => parseNumericValue(row[yAxis[1]])),
          };

          await Plotly.newPlot(hiddenDiv, [trace]);
          const dataUrl = await Plotly.toImage(hiddenDiv, { format: 'png' });

          Plotly.purge(hiddenDiv);
          document.body.removeChild(hiddenDiv);
          resolve(dataUrl);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleDownloadReport = async (file) => {
    setLoading(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Analysis Report", 105, 20, { align: "center" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`File Name: ${file.fileName}`, 15, 35);
      doc.text(`Upload Date: ${new Date(file.uploadDate).toLocaleDateString()}`, 15, 42);
      doc.setLineWidth(0.5);
      doc.line(15, 48, 195, 48);

      if (file.analyses && file.analyses.length > 0) {
        doc.setFontSize(16);
        doc.text("Analyses Summary", 15, 60);
        const tableData = file.analyses.map((analysis, index) => [
          index + 1,
          analysis.chartType.charAt(0).toUpperCase() + analysis.chartType.slice(1),
          analysis.xAxis,
          Array.isArray(analysis.yAxis) ? analysis.yAxis.join(', ') : analysis.yAxis
        ]);
        doc.autoTable({
          startY: 65,
          head: [['#', 'Chart Type', 'X-Axis', 'Y-Axis']],
          body: tableData, theme: 'grid', headStyles: { fillColor: [22, 160, 133] }
        });
      }

      if (file.analyses && file.analyses.length > 0) {
        doc.addPage();
        doc.setFontSize(18);
        doc.text("Detailed Analysis", 15, 20);
        let currentY = 30;

        for (const analysis of file.analyses) {
          if (currentY > 180) {
            doc.addPage();
            currentY = 20;
          }

          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          const yAxisText = Array.isArray(analysis.yAxis) ? analysis.yAxis.join(' & ') : analysis.yAxis;
          doc.text(`${analysis.chartType.toUpperCase()} Chart: ${yAxisText} vs ${analysis.xAxis}`, 15, currentY);
          currentY += 8;

          const imageDataUrl = await generateChartImage(analysis, file.processedData);
          if (imageDataUrl) {
            doc.addImage(imageDataUrl, 'PNG', 15, currentY, 180, 90);
            currentY += 100;
          } else {
            doc.setFont("helvetica", "italic");
            doc.setTextColor(255, 0, 0);
            doc.text("[Chart image could not be generated for this analysis]", 15, currentY + 40);
            doc.setTextColor(0, 0, 0);
            currentY += 90;
          }
          doc.setFont("helvetica", "bold");
          doc.text("AI Insight:", 15, currentY);
          currentY += 6;
          
          const aiInsightText = generateDynamicInsight(file.processedData, analysis.xAxis, analysis.yAxis, analysis.chartType);
          const splitText = doc.splitTextToSize(aiInsightText, 180);
          doc.setFont("helvetica", "normal");
          doc.text(splitText, 15, currentY);
          currentY += 30;
        }
      }

      doc.save(`${file.fileName}_report.pdf`);
      setAlert({ show: true, message: 'Detailed report downloaded successfully!', type: 'success' });
    } catch (err) {
      console.error("Detailed PDF Generation Error:", err);
      setAlert({ show: true, message: 'Failed to generate detailed PDF. Check console.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    const placeholder = (message) => (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
        <FaChartPie size={60} className="mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm">Your visual masterpiece will appear here.</p>
      </div>
    );
    
    if (loading) return placeholder("Generating Chart...");
    if (!chartData) return placeholder("Upload data and generate a chart.");

    const is2DChart = ['line', 'bar', 'pie'].includes(chartType);
    const is3DChart = chartType === '3d';
    
    // This check prevents the crash.
    if ((is2DChart && !chartData.datasets) || (is3DChart && !Array.isArray(chartData))) {
        return placeholder("Switching chart type...");
    }

    const fgColor = isDarkMode ? '#E5E7EB' : '#1F2937';
    const subtleColor = isDarkMode ? '#4B5563' : '#D1D5DB';

    const options = {
      responsive: true,
      plugins: {
        legend: { position: "top", labels: { color: fgColor, font: { size: 14 } } },
        title: { display: true, text: `Chart of ${yAxis.join(", ")} vs ${xAxis}`, color: fgColor, font: { size: 18, weight: 'bold' } },
      },
      scales: {
        x: { ticks: { color: fgColor }, grid: { color: subtleColor } },
        y: { ticks: { color: fgColor }, grid: { color: subtleColor } },
      },
      maintainAspectRatio: false,
    };

    if (is3DChart) {
      return (
        <PlotlyComponent
          ref={plotlyRef}
          data={chartData}
          layout={{
            margin: { l: 0, r: 0, b: 0, t: 40 }, paper_bgcolor: "transparent", plot_bgcolor: "transparent",
            font: { color: fgColor }, title: { text: `3D Chart of ${yAxis.join(" & ")} vs ${xAxis}`, font: { color: fgColor } },
            scene: {
              xaxis: { title: xAxis, color: fgColor, gridcolor: subtleColor },
              yaxis: { title: yAxis[0], color: fgColor, gridcolor: subtleColor },
              zaxis: { title: yAxis[1], color: fgColor, gridcolor: subtleColor },
            }
          }}
          style={{ width: "100%", height: "100%" }} config={{ responsive: true }}
        />
      );
    }
    if (is2DChart) {
      switch (chartType) {
        case "line": return <Line data={chartData} options={options} id="chart-canvas" />;
        case "bar": return <Bar data={chartData} options={options} id="chart-canvas" />;
        case "pie": return <Pie data={chartData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: `Distribution of ${yAxis[0]}` } } }} id="chart-canvas" />;
        default: return placeholder("Select a chart type.");
      }
    }
    return placeholder("Unsupported chart type.");
  };

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 transition-all duration-300 hover:shadow-green-500/10 hover:border-green-500/30">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-400">{icon}</div>
        <div>
          <h2 className="text-gray-500 dark:text-gray-400 font-medium text-sm">{title}</h2>
          <p className="text-3xl font-bold mt-1 text-gray-800 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    const columnOptions = columnHeaders.map(h => ({ label: h, value: h }));
    const chartOptions = [
      { label: 'Line Chart', value: 'line' },
      { label: 'Bar Chart', value: 'bar' },
      { label: 'Pie Chart', value: 'pie' },
      { label: '3D Scatter Plot', value: '3d' },
    ];

    switch (activeTab) {
      case "analytics":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Projects" value={dashboardStats.totalProjects} icon={<FaTable size={24} />} />
              <StatCard title="Analyses Ran" value={dashboardStats.recentViews} icon={<FaChartLine size={24} />} />
              <StatCard title="Last Active" value={dashboardStats.lastActive} icon={<FaUser size={24} />} />
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">New Analysis</h2>

              <label className="flex flex-col items-center justify-center space-y-4 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all cursor-pointer">
                <FaUpload className="text-green-500 text-5xl" />
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">{uploadedFileName ? `Loaded: ${uploadedFileName}` : "Drag & drop or click to upload"}</span>
                <p className="text-sm text-gray-400 dark:text-gray-500">{uploadedFileName ? "You can now select another file to replace it." : "Supported formats: .xls, .xlsx"}</p>
                <input type="file" onChange={handleFileUpload} accept=".xls,.xlsx" className="hidden" />
              </label>

              {isFileUploaded && (
                <div className="mt-8 animate-fade-in-up">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">X-Axis (Category)</label>
                      <CustomSelector options={columnOptions} selectedValue={xAxis} onChange={setXAxis} />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Y-Axis (Values)</label>
                      <CustomSelector options={columnOptions} selectedValue={yAxis} onChange={setYAxis} isMultiSelect />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click to select/deselect multiple.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Chart Type</label>
                      <CustomSelector options={chartOptions} selectedValue={chartType} onChange={setChartType} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                    <button onClick={generateChart} disabled={!excelData?.length || !xAxis || yAxis.length === 0} className="flex-1 p-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                      <FaChartLine />
                      <span>Generate Chart</span>
                    </button>
                    <button onClick={handleGetAiInsight} disabled={!chartData} className="flex-1 p-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                      <FaRobot />
                      <span>Get AI Insights</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 relative min-h-[500px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Data Visualization</h2>
                {chartData && (
                  <div className="flex space-x-3">
                    <button onClick={() => handleDownload('png')} title="Download as PNG" className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors shadow-sm"><FaFileImage /></button>
                    <button onClick={() => handleDownload('pdf')} title="Download as PDF" className="p-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-900 transition-colors shadow-sm"><FaFilePdf /></button>
                  </div>
                )}
              </div>
              <div className="h-[450px] bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">{renderChart()}</div>
            </div>

            {aiInsight && (
              <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 mt-8 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center space-x-3"><FaRobot className="text-green-500" /><span>AI-Powered Insights</span></h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-mono">{aiInsight}</p>
              </div>
            )}
          </>
        );

      case "reports":
        const filteredHistory = fileHistory.filter(file => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Reports</h1>
              <div className="w-1/3 relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search reports..." className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500" />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {loading && !viewingReport ? (<p>Loading...</p>) : error ? (<p className="text-red-500 text-center">{error}</p>) :
              filteredHistory.length === 0 ? (
                <div className="text-center py-20">
                  <FaTable size={80} className="mx-auto text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 mt-4 text-xl">
                    {searchQuery ? 'No reports match your search.' : 'Your reports will appear here.'}
                  </p>
                  <p className="text-gray-400">Upload a file on the "My Analytics" tab to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHistory.map((file) => (
                    <div key={file._id} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 transition-all hover:shadow-green-500/20 hover:-translate-y-1">
                      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 break-words mb-2">
                        {file.fileName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Analysis History ({file.analyses?.length || 0})
                        </h4>
                        {file.analyses?.length === 0 ? (
                          <p className="text-gray-400 dark:text-gray-500 text-sm italic">No analysis performed yet.</p>
                        ) : (
                          <ul className="space-y-1 text-sm">
                            {file.analyses?.slice(0, 3).map((analysis, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                                <FaChartLine className="text-green-500" />
                                <span>{analysis.chartType} chart of {analysis.xAxis}</span>
                              </li>
                            ))}
                            {file.analyses.length > 3 && <li className="text-gray-500 text-xs pl-6">...and {file.analyses.length - 3} more</li>}
                          </ul>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-6">
                        <button onClick={() => loadFileFromHistory(file.fileId)} className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
                          View Report
                        </button>
                        <button onClick={() => handleDownloadReport(file)} className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {viewingReport && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all animate-fade-in-up">
                  <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{viewingReport.fileName}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded: {new Date(viewingReport.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button onClick={() => setViewingReport(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                      <FaTimes size={24} />
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">AI Insight</h3>
                    <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg text-sm mb-6">
                      {viewingReport.analyses && viewingReport.analyses.length > 0
                         ? generateDynamicInsight(viewingReport.processedData, viewingReport.analyses[0].xAxis, viewingReport.analyses.flatMap(a => a.yAxis), 'summary')
                         : "No analysis available to generate insights."
                      }
                    </p>

                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Analysis History ({viewingReport.analyses?.length || 0})</h3>
                    <div className="space-y-4">
                      {viewingReport.analyses?.length > 0 ? (
                        viewingReport.analyses.map((analysis, index) => (
                          <div key={index} className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                            <p className="font-bold text-green-600 dark:text-green-400">{index + 1}. {analysis.chartType.toUpperCase()} Chart</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>X-Axis:</strong> {analysis.xAxis}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Y-Axis:</strong> {Array.isArray(analysis.yAxis) ? analysis.yAxis.join(', ') : analysis.yAxis}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No analysis performed on this file.</p>
                      )}
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <button
                      onClick={() => handleDownloadReport(viewingReport)}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <FaFilePdf />
                      <span>Download Full Report as PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case "profile":
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
      {alert.show && (
        <CustomAlert message={alert.message} isSuccess={alert.type === 'success'} onClose={() => setAlert({ ...alert, show: false })} />
      )}
      <aside className="w-72 bg-white dark:bg-gray-800 p-6 flex flex-col shadow-2xl border-r border-gray-200 dark:border-gray-700/50">
        <div className="mb-12 flex items-center space-x-3">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="text-green-500">
            <FaChartPie size={40} />
          </motion.div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">Sheet<span className="text-green-500">Insights</span></p>
          </div>
        </div>

        <nav className="space-y-3">
          <button onClick={() => setActiveTab("analytics")} className={`w-full p-3 rounded-lg font-semibold tracking-wide flex items-center transition-all duration-300 text-left ${activeTab === "analytics" ? "bg-green-500 text-white shadow-lg" : "hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"}`}>
            <FaChartLine className="mr-4" /> My Analytics
          </button>
          <button onClick={() => setActiveTab("reports")} className={`w-full p-3 rounded-lg font-semibold tracking-wide flex items-center transition-all duration-300 text-left ${activeTab === "reports" ? "bg-green-500 text-white shadow-lg" : "hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"}`}>
            <FaTable className="mr-4" /> My Reports
          </button>
          <button onClick={() => setActiveTab("profile")} className={`w-full p-3 rounded-lg font-semibold tracking-wide flex items-center transition-all duration-300 text-left ${activeTab === "profile" ? "bg-green-500 text-white shadow-lg" : "hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"}`}>
            <FaUser className="mr-4" /> Profile
          </button>
        </nav>

        <div className="mt-auto pt-6">
          <button onClick={handleLogout} className="flex items-center justify-center p-3 bg-red-500 w-full rounded-lg font-medium transition-all text-white hover:bg-red-600 hover:shadow-lg">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <header className="mb-10 pb-6 border-b border-gray-200 dark:border-gray-700/50 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Welcome, <span className="text-green-500">{user.fullname || "User"}</span>!</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your data at a glance. Let's uncover some insights!</p>
          </div>
          <button onClick={toggleDarkMode} className={`p-3 rounded-full shadow-md transition-colors duration-300 ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-700/10 text-gray-600 hover:bg-gray-700/20"}`}>
            {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
          </button>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default UserDashboard;