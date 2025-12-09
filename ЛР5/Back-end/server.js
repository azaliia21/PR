// Простейший сервер для учебных предметов
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Читаем файл с предметами
let subjects = JSON.parse(fs.readFileSync('subjects.json', 'utf8'));

// Создаём сервер
const server = http.createServer((req, res) => {
  // Включаем CORS (разрешаем запросы с других сайтов)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Обрабатываем OPTIONS запрос (для CORS)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Обрабатываем разные запросы
  if (req.method === 'GET' && req.url === '/subjects') {
    // GET /subjects - получить все предметы
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(subjects));
  }
  else if (req.method === 'GET' && req.url.startsWith('/subjects/')) {
    // GET /subjects/1 - получить предмет по ID
    const id = parseInt(req.url.split('/')[2]);
    const subject = subjects.find(s => s.id === id);
    
    if (subject) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(subject));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Subject not found' }));
    }
  }
  else if (req.method === 'POST' && req.url === '/subjects') {
    // POST /subjects - создать новый предмет
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const newSubject = JSON.parse(body);
        newSubject.id = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
        subjects.push(newSubject);
        
        // Сохраняем в файл
        fs.writeFileSync('subjects.json', JSON.stringify(subjects, null, 2));
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newSubject));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  else if (req.method === 'PATCH' && req.url.startsWith('/subjects/')) {
    // PATCH /subjects/1 - обновить предмет
    const id = parseInt(req.url.split('/')[2]);
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const index = subjects.findIndex(s => s.id === id);
        
        if (index !== -1) {
          subjects[index] = { ...subjects[index], ...updates };
          
          // Сохраняем в файл
          fs.writeFileSync('subjects.json', JSON.stringify(subjects, null, 2));
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(subjects[index]));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Subject not found' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  else if (req.method === 'DELETE' && req.url.startsWith('/subjects/')) {
    // DELETE /subjects/1 - удалить предмет
    const id = parseInt(req.url.split('/')[2]);
    const initialLength = subjects.length;
    subjects = subjects.filter(s => s.id !== id);
    
    if (subjects.length < initialLength) {
      // Сохраняем в файл
      fs.writeFileSync('subjects.json', JSON.stringify(subjects, null, 2));
      
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Subject not found' }));
    }
  }
  else {
    // Если запрос не распознан
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Запускаем сервер на порту 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
  console.log('📚 Доступные пути:');
  console.log('  GET    /subjects     - все предметы');
  console.log('  GET    /subjects/:id - предмет по ID');
  console.log('  POST   /subjects     - создать предмет');
  console.log('  PATCH  /subjects/:id - обновить предмет');
  console.log('  DELETE /subjects/:id - удалить предмет');
});
