import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  Grid,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";

const Expenses = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [expense, setExpense] = useState({
    expense_name: "",
    expense_type: "",
    amount: "",
    date: "",
  });

  const [expenses, setExpenses] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:80/api/v1/expense", expense);
      console.log("Expense logged:", response.data);
      setExpense({
        expense_name: "",
        expense_type: "",
        amount: "",
        date: "",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error logging expense:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:80/api/v1/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <Box m="20px">
      <Header title="EXPENSES" subtitle="Log and view your expenses" />

      <Box
        backgroundColor={colors.primary[400]}
        p="30px"
        borderRadius="4px"
        mb="20px"
      >
        <Typography variant="h5" fontWeight="600" mb="15px">
          Log New Expense
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expense Name"
                name="expense_name"
                variant="outlined"
                value={expense.expense_name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Expense Type"
                name="expense_type"
                variant="outlined"
                value={expense.expense_type}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                variant="outlined"
                value={expense.amount}
                onChange={handleInputChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                variant="outlined"
                value={expense.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            LOG EXPENSE
          </Button>
        </form>
      </Box>

      <Box
        backgroundColor={colors.primary[400]}
        p="30px"
        borderRadius="4px"
      >
        <Typography variant="h5" fontWeight="600" mb="15px">
          Expense List
        </Typography>
        <Button
          onClick={fetchExpenses}
          variant="contained"
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            mb: 2,
          }}
        >
          UPDATE EXPENSES
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Expense Name</TableCell>
                <TableCell>Expense Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.ExpenseID}>
                  <TableCell>{exp.ExpenseName}</TableCell>
                  <TableCell>{exp.ExpenseType}</TableCell>
                  <TableCell>${exp.Amount}</TableCell>
                  <TableCell>{new Date(exp.Date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Expenses;