import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";
import BoltIcon from "@mui/icons-material/Bolt";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";

// Mock data for meter readings
const mockMeterReadings = [
  { id: 1, ReadingID: "R001", UserID: "U1", Timestamp: "2024-10-01T10:00:00", EnergyProduced: 5.5, EnergyConsumed: 3.2 },
  { id: 2, ReadingID: "R002", UserID: "U1", Timestamp: "2024-10-01T11:00:00", EnergyProduced: 6.2, EnergyConsumed: 2.8 },
  { id: 3, ReadingID: "R003", UserID: "U1", Timestamp: "2024-10-01T12:00:00", EnergyProduced: 7.1, EnergyConsumed: 3.5 },
  // Add more mock data as needed
];

const MeterReadings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    { field: "ReadingID", headerName: "Reading ID", flex: 1 },
    { field: "UserID", headerName: "User ID", flex: 1 },
    { 
      field: "Timestamp", 
      headerName: "Timestamp", 
      flex: 1,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "EnergyProduced",
      headerName: "Energy Produced (kWh)",
      flex: 1,
      renderCell: (params) => params.value.toFixed(2),
    },
    {
      field: "EnergyConsumed",
      headerName: "Energy Consumed (kWh)",
      flex: 1,
      renderCell: (params) => params.value.toFixed(2),
    },
  ];

  // Calculate summary statistics
  const totalProduced = mockMeterReadings.reduce((sum, reading) => sum + reading.EnergyProduced, 0);
  const totalConsumed = mockMeterReadings.reduce((sum, reading) => sum + reading.EnergyConsumed, 0);
  const netEnergy = totalProduced - totalConsumed;

  return (
    <Box m="20px">
      <Header title="METER READINGS" subtitle="View your smart meter readings" />
      
      {/* Summary Statistics */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        mb="20px"
      >
        <StatBox
          title={`${totalProduced.toFixed(2)} kWh`}
          subtitle="Total Energy Produced"
          icon={<BoltIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
        />
        <StatBox
          title={`${totalConsumed.toFixed(2)} kWh`}
          subtitle="Total Energy Consumed"
          icon={<OfflineBoltIcon sx={{ color: colors.redAccent[600], fontSize: "26px" }} />}
        />
        <StatBox
          title={`${netEnergy.toFixed(2)} kWh`}
          subtitle="Net Energy"
          icon={<ElectricMeterIcon sx={{ color: colors.blueAccent[600], fontSize: "26px" }} />}
        />
      </Box>

      {/* Data Grid */}
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={mockMeterReadings}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Box>

      <Box pb="40px" />
    </Box>
  );
};

export default MeterReadings;