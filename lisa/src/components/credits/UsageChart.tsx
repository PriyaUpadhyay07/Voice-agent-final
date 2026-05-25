"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Calendar } from "lucide-react";

export default function UsageChart({ userId }: { userId?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"daily" | "weekly">("daily");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Dynamically calculate the last 12 months based on current calendar date
  const recentMonths = (() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yearStr = d.getFullYear();
      const monthVal = String(d.getMonth() + 1).padStart(2, "0");
      const monthLabel = d.toLocaleString("en-US", { month: "long", year: "numeric" });
      list.push({
        value: `${yearStr}-${monthVal}`,
        label: monthLabel
      });
    }
    return list;
  })();

  const [selectedMonth, setSelectedMonth] = useState<string>(recentMonths[0].value);

  useEffect(() => {
    fetch(`/api/vapi-usage?userId=${userId || ""}`)
      .then(res => res.json())
      .then(d => {
        setData(d.chartData || []);
      })
      .catch(err => console.error("Error loading usage chart:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  // Click outside to close month dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Perform pixel-perfect Daily / Weekly data calculations
  const getDisplayData = () => {
    const [yearStr, monthStr] = selectedMonth.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1; // 0-indexed month
    
    // Total days in the selected month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Construct all calendar days for this month
    const dailyData = [];
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${yearStr}-${monthStr}-${String(day).padStart(2, "0")}`;
      const match = data.find(item => item.date === dateStr);
      dailyData.push({
        date: dateStr,
        mins: match ? match.mins : 0
      });
    }
    
    if (viewType === "daily") {
      return dailyData;
    }
    
    // Weekly grouping: group days into weeks starting on Mondays
    const weeklyGroups: { [key: string]: number } = {};
    const weekLabelsOrder: string[] = [];
    
    dailyData.forEach(item => {
      const d = new Date(item.date);
      const dayOfWeek = d.getDay();
      
      // Calculate Monday of that week
      const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const mondayDate = new Date(d.setDate(diff));
      
      const monMonth = mondayDate.toLocaleString("en-US", { month: "short" });
      const monDay = mondayDate.getDate();
      const label = `Week of ${monMonth} ${monDay}`;
      
      if (weeklyGroups[label] === undefined) {
        weeklyGroups[label] = 0;
        weekLabelsOrder.push(label);
      }
      weeklyGroups[label] += item.mins;
    });
    
    return weekLabelsOrder.map(label => ({
      date: label,
      mins: weeklyGroups[label]
    }));
  };

  const displayData = getDisplayData();
  const totalMinsSelected = displayData.reduce((acc, item) => acc + item.mins, 0);

  // 3. Round Y-axis limits to 4 clean steps (e.g. 0, 2, 4, 6, 8 or 0, 3, 6, 9, 12)
  const maxMins = Math.max(...displayData.map(d => d.mins), 1);
  
  // Make it round up to a multiple of 4 to display clean integer levels
  const roundedMaxMins = Math.max(4, Math.ceil(maxMins / 4) * 4);
  
  const yLabels = [];
  for (let i = 4; i >= 0; i--) {
    yLabels.push((roundedMaxMins * i) / 4);
  }

  const getMonthLabel = () => {
    const match = recentMonths.find(m => m.value === selectedMonth);
    return match ? match.label : selectedMonth;
  };

  return (
    <div style={{
      background: "rgba(0,0,0,0.18)",
      borderRadius: 20,
      padding: "28px 32px",
      border: "1px solid rgba(255,255,255,0.03)",
      marginTop: 20
    }}>
      {/* Controls Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        {/* Dynamic Big Mins Display */}
        <div>
          <span style={{ fontSize: 13, color: "var(--text-muted)", display: "block", marginBottom: 4, fontWeight: 500 }}>Usage</span>
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.5px" }}>{totalMinsSelected.toFixed(3)} Mins</span>
        </div>

        {/* Daily/Weekly Toggle Buttons */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 10, border: "1px solid var(--border)" }}>
          <button 
            onClick={() => setViewType("daily")}
            style={{ 
              padding: "6px 18px", 
              borderRadius: 8, 
              background: viewType === "daily" ? "rgba(255,255,255,0.08)" : "transparent", 
              color: viewType === "daily" ? "#fff" : "var(--text-muted)", 
              border: "none", 
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            Daily
          </button>
          <button 
            onClick={() => setViewType("weekly")}
            style={{ 
              padding: "6px 18px", 
              borderRadius: 8, 
              background: viewType === "weekly" ? "rgba(255,255,255,0.08)" : "transparent", 
              color: viewType === "weekly" ? "#fff" : "var(--text-muted)", 
              border: "none", 
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            Weekly
          </button>
        </div>

        {/* Smart Dynamic Month Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button 
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              background: "rgba(255,255,255,0.03)", 
              border: "1px solid var(--border)", 
              padding: "8px 16px",
              borderRadius: 10,
              color: "var(--text)", 
              fontSize: 13, 
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            <Calendar size={14} color="#10b981" />
            {getMonthLabel()} 
            <ChevronDown size={14} style={{ transform: showMonthDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {showMonthDropdown && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: 12,
              padding: 6,
              zIndex: 100,
              width: 160,
              maxHeight: 240,
              overflowY: "auto",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)"
            }}>
              {recentMonths.map((m) => (
                <div 
                  key={m.value}
                  onClick={() => {
                    setSelectedMonth(m.value);
                    setShowMonthDropdown(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    color: selectedMonth === m.value ? "#10b981" : "#a1a1aa",
                    background: selectedMonth === m.value ? "rgba(16, 185, 129, 0.08)" : "transparent",
                    fontWeight: selectedMonth === m.value ? 600 : 400,
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMonth !== m.value) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedMonth === m.value ? "rgba(16, 185, 129, 0.08)" : "transparent";
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Layout with Y-Axis, Dotted Grid Lines & Bars */}
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        {/* Y-Axis Labels Column */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          height: 180, 
          paddingBottom: 2, 
          fontSize: 11, 
          color: "#555", 
          width: 24, 
          textAlign: "right",
          userSelect: "none"
        }}>
          {yLabels.map((val, i) => (
            <div key={i}>{val.toFixed(0)}</div>
          ))}
        </div>

        {/* Main Chart Board */}
        <div style={{ flex: 1, height: 180, position: "relative" }}>
          {/* Dashed Grid Lines (in background) */}
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between", 
            pointerEvents: "none" 
          }}>
            {yLabels.map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  borderBottom: i === yLabels.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "1px dashed rgba(255,255,255,0.05)", 
                  width: "100%", 
                  height: 0 
                }} 
              />
            ))}
          </div>

          {/* Dymamic Emerald Bars */}
          <div style={{ 
            position: "absolute", 
            inset: 0, 
            display: "flex", 
            alignItems: "flex-end", 
            gap: viewType === "daily" ? 4 : 20, 
            paddingBottom: 1 
          }}>
            {loading ? (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13 }}>
                Loading chart...
              </div>
            ) : displayData.length === 0 ? (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13 }}>
                No minutes used in {getMonthLabel()}
              </div>
            ) : (
              displayData.map((item, idx) => {
                const heightPct = (item.mins / roundedMaxMins) * 100;
                const maxBarWidth = viewType === "daily" ? 14 : 72;

                return (
                  <div 
                    key={idx} 
                    style={{ 
                      flex: 1, 
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      height: "100%", 
                      justifyContent: "flex-end" 
                    }}
                  >
                    {/* Emerald bar with soft glow and clean top rounded corners */}
                    <div 
                      title={`${item.date}: ${item.mins.toFixed(3)} mins used`}
                      style={{ 
                        width: "100%", 
                        maxWidth: maxBarWidth,
                        height: `${Math.max(heightPct, 0)}%`,
                        background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                        boxShadow: item.mins > 0 ? "0 0 10px rgba(16, 185, 129, 0.15)" : "none",
                        borderRadius: "4px 4px 0 0",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        position: "relative"
                      }} 
                      onMouseEnter={(e) => {
                        if (item.mins > 0) {
                          e.currentTarget.style.filter = "brightness(1.15)";
                          e.currentTarget.style.boxShadow = "0 0 14px rgba(16, 185, 129, 0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = "none";
                        e.currentTarget.style.boxShadow = item.mins > 0 ? "0 0 10px rgba(16, 185, 129, 0.15)" : "none";
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* X-Axis Labels Row */}
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        {/* Spacer to match Y-Axis width */}
        <div style={{ width: 24 }} />
        
        {/* Labels Row matching bar alignment perfectly */}
        <div style={{ 
          flex: 1, 
          display: "flex", 
          gap: viewType === "daily" ? 4 : 20,
          userSelect: "none"
        }}>
          {displayData.map((item, idx) => {
            const dayNum = viewType === "daily" ? parseInt(item.date.split("-")[2]) : 0;
            
            // For daily view: show labels for Day 1, 4, 7, 10... and ALWAYS for the last day of the month!
            const shouldShowLabel = viewType === "weekly" || (
              dayNum === 1 || 
              (dayNum - 1) % 3 === 0 || 
              idx === displayData.length - 1
            );

            return (
              <div 
                key={idx} 
                style={{ 
                  flex: 1, 
                  fontSize: 10, 
                  color: "#666", 
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  opacity: shouldShowLabel ? 1 : 0,
                  pointerEvents: "none",
                  transition: "opacity 0.15s"
                }}
              >
                {viewType === "daily" ? (shouldShowLabel ? item.date : "") : item.date}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
