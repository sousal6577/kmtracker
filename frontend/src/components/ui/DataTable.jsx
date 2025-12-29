// src/components/ui/DataTable.jsx - Tabela de Dados Moderna
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Skeleton,
} from '@mui/material';

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  rowKey = 'id',
}) {
  // Loading Skeleton
  if (loading) {
    return (
      <TableContainer
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx}>
                  <Skeleton variant="text" width={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, idx) => (
              <TableRow key={idx}>
                {columns.map((col, colIdx) => (
                  <TableCell key={colIdx}>
                    <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Empty State
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          p: 6,
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            }}
          >
            {columns.map((column, idx) => (
              <TableCell
                key={idx}
                align={column.align || 'left'}
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  whiteSpace: 'nowrap',
                  width: column.width,
                  minWidth: column.minWidth,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIdx) => (
            <TableRow
              key={row[rowKey] || rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                },
                '&:last-child td': {
                  borderBottom: 'none',
                },
              }}
            >
              {columns.map((column, colIdx) => (
                <TableCell
                  key={colIdx}
                  align={column.align || 'left'}
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    py: 2,
                  }}
                >
                  {column.render 
                    ? column.render(row)
                    : row[column.field || column.id] || '-'
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
