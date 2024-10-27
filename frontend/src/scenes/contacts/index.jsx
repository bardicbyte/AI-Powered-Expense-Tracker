import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper
} from '@mui/material';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from '@mui/material/styles';

const InvoiceUpload = () => {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState(null);
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/process-invoice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Received invoice data:', response.data);  // Log the received data
      setInvoiceData(response.data);
    } catch (err) {
      setError('Error processing invoice: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmitExpense = async () => {
    if (!invoiceData) {
      setError('No invoice data to submit.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/expense', {
        invoice_data: invoiceData
      });
      alert(`Successfully logged expenses!`);
      setInvoiceData(null);
      setFile(null);
    } catch (err) {
      setError('Error logging expenses: ' + err.message);
    }
  };

  const renderInvoiceTable = () => {
    if (!invoiceData) return null;

    let items = [];
    if (Array.isArray(invoiceData.items)) {
      items = invoiceData.items;
    } else if (typeof invoiceData.items === 'object') {
      items = [invoiceData.items];
    } else if (Array.isArray(invoiceData)) {
      items = invoiceData;
    } else if (typeof invoiceData === 'object') {
      items = [invoiceData];
    } else {
      return <Typography color="error">Invalid invoice data structure</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.item_name || item.name || 'N/A'}</TableCell>
                <TableCell>{item.item_quantity || item.quantity || 'N/A'}</TableCell>
                <TableCell>{item.item_value || item.value ? `$${item.item_value || item.value}` : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box m="20px">
      <Header title="INVOICE UPLOAD" subtitle="Upload and process invoice images" />
      
      <Box display="flex" flexDirection="column" gap={2}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Select Invoice Image
          </Button>
        </label>
        {file && <Typography>{file.name}</Typography>}
        
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || processing}
          sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100] }}
        >
          {processing ? <CircularProgress size={24} /> : 'Process Invoice'}
        </Button>

        {error && (
          <Typography color="error">{error}</Typography>
        )}

        {invoiceData && (
          <Box mt={2}>
            <Typography variant="h6" mb={1}>Processed Invoice Data:</Typography>
            {renderInvoiceTable()}
            <Button
              onClick={handleSubmitExpense}
              variant="contained"
              sx={{ mt: 2, backgroundColor: colors.greenAccent[700], color: colors.grey[100] }}
            >
              Submit as Expense
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InvoiceUpload;