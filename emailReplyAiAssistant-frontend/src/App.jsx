import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// 1. Create a dark theme with rounded shape
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // light blue
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
  shape: {
    borderRadius: 10, // global border radius
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      console.error('Error generating reply:', error);
      setGeneratedReply('An error occurred while generating the reply.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReply);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          ✉️ Email Reply Generator
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mt: 4,
          }}
        >
          {/* Input Card */}
          <Card
            elevation={3}
            sx={{
              flex: 1,
              minWidth: 0,
              backgroundColor: 'background.paper',
              color: 'text.primary',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mx: 1 }} gutterBottom>
                Original Email
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                placeholder="Paste your email content here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                sx={{ mb: 3, borderRadius: 2 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />

              <FormControl fullWidth variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                <InputLabel id="tone-label">Tone (Optional)</InputLabel>
                <Select
                  labelId="tone-label"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  label="Tone (Optional)"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!emailContent || loading}
                  onClick={handleSubmit}
                  sx={{ px: 4, py: 1.5, borderRadius: 3, mx: 2 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Generated Reply Card */}
          {generatedReply && (
            <Card
              elevation={3}
              sx={{
                flex: 1,
                backgroundColor: 'background.paper',
                color: 'text.primary',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mx: 1, mb: 2, mt: 1 }} gutterBottom>
                  Generated Reply
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={15}
                  variant="outlined"
                  value={generatedReply}
                  InputProps={{
                    readOnly: true,
                    sx: { borderRadius: 3 },
                  }}
                  sx={{ mb: 2 }}
                />

                <Tooltip title="Copy to Clipboard">
                  <IconButton color="primary" onClick={handleCopy} sx={{ borderRadius: 2 }}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </CardContent>
            </Card>
          )}
        </Box>

      </Container>
    </ThemeProvider>
  );
}

export default App;
