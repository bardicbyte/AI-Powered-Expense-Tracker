import { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      field: "ExpenseID",
      headerName: "ID",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "ExpenseName",
      headerName: "Expense Name",
      flex: 1,
      minWidth: 150,
      cellClassName: "name-column--cell",
    },
    {
      field: "ExpenseType",
      headerName: "Type",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "Amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          ${Number(params.row.Amount).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "Date",
      headerName: "Date",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Typography>
          {new Date(params.row.Date).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/v1/expenses");
      const expensesWithId = response.data.map(expense => ({
        ...expense,
        id: expense.ExpenseID
      }));
      setExpenses(expensesWithId);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete("http://localhost:8000/api/v1/expenses");
      setExpenses([]);
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Expense Report", 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Calculate total expenses
    const total = expenses.reduce((sum, expense) => sum + Number(expense.Amount), 0);
    doc.text(`Total Expenses: $${total.toFixed(2)}`, 14, 42);

    // Create the table
    const tableData = expenses.map(expense => [
      expense.ExpenseName,
      expense.ExpenseType,
      `$${Number(expense.Amount).toFixed(2)}`,
      new Date(expense.Date).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 50,
      head: [['Expense Name', 'Type', 'Amount', 'Date']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontSize: 12
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Save the PDF
    doc.save('expense-report.pdf');
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header 
          title="EXPENSES" 
          subtitle="View and manage your expense history" 
        />
        <Box display="flex" gap="10px">
          <Button
            onClick={downloadPDF}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              '&:hover': {
                backgroundColor: colors.blueAccent[800],
              },
            }}
          >
            Download PDF
          </Button>
          <Button
            onClick={handleDeleteAll}
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              backgroundColor: colors.redAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              '&:hover': {
                backgroundColor: colors.redAccent[800],
              },
            }}
          >
            Delete All
          </Button>
        </Box>
      </Box>

      <Box
        m="40px 0 0 0"
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
          rows={expenses}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          loading={loading}
          getRowHeight={() => 'auto'}
          checkboxSelection
          disableSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: 'Date', sort: 'desc' }],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;