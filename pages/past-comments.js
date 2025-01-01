import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function PastComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const reflections = JSON.parse(localStorage.getItem('reflections')) || [];
    const commentsWithDates = reflections
      .filter((reflection) => reflection.comments && reflection.comments.trim() !== '')
      .map((reflection) => ({
        date: reflection.date,
        comment: reflection.comments,
      }));
    setComments(commentsWithDates);
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Past Comments
      </Typography>

      {comments.length > 0 ? (
        <List>
          {comments.map((entry, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px solid #ddd', whiteSpace: 'pre-wrap' }}>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {entry.comment}
                  </Typography>
                }
                secondary={`Date: ${entry.date}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No past comments available.</Typography>
      )}
    </Box>
  );
}