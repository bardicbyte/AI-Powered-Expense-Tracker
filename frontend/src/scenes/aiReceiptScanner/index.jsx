import React, { useState } from 'react';
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

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const AI_PROCESSOR_URL = process.env.REACT_APP_AI_PROCESSOR_URL || 'http://localhost:8001';

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
      const response = await axios.post(`${AI_PROCESSOR_URL}/process`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Received invoice data:', response.data);
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
      // Format the data to match the API expectations
      const formattedData = {
        line_items: Array.isArray(invoiceData.line_items) 
          ? invoiceData.line_items 
          : [invoiceData.line_items],
        store_name: invoiceData.store_name || 'Unknown Store'
      };

      // Log the data being sent
      console.log('Sending data to API:', formattedData);

      const response = await axios.post(`${API_URL}/api/v1/expense/automatic`, formattedData);
      
      console.log('API Response:', response.data);
      alert('Successfully logged expenses!');
      setInvoiceData(null);
      setFile(null);
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      setError('Error logging expenses: ' + (err.response?.data?.error || err.message));
    }
  };

  const renderInvoiceTable = () => {
    if (!invoiceData) return null;

    let items = Array.isArray(invoiceData.line_items) 
      ? invoiceData.line_items 
      : [invoiceData.line_items];

    return (
      <Box>
        <Typography variant="h6" mb={1}>Store: {invoiceData.store_name || 'Unknown Store'}</Typography>
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
                  <TableCell>{item.item_name || 'N/A'}</TableCell>
                  <TableCell>{item.item_quantity || '1'}</TableCell>
                  <TableCell>{item.item_value ? `$${item.item_value}` : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
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