const fs = require('fs');
fetch('http://localhost:5000/api/files')
  .then(res => res.json())
  .then(data => {
      console.log('GET /api/files RESPONSE:', data);
  })
  .catch(err => console.error('Error fetching:', err));
