const net = require('net');
const exec = require('child_process').exec;

// Function to check if a port is in use
const checkPort = (port) => {
  const server = net.createServer().listen(port);
  server.on('listening', () => {
    console.log(`Port ${port} is free.`);
    server.close();
  });
  server.on('error', (err) => {
    console.log(`Port ${port} is in use!`);
    // Find the process using the port and kill it
    exec(`netstat -aon | findstr ${port}`, (error, stdout, stderr) => {
      if (stdout) {
        const pid = stdout.split(/\s+/).pop();
        console.log(`Killing process with PID: ${pid}`);
        exec(`taskkill /PID ${pid} /F`, (killErr, killStdout, killStderr) => {
          if (killErr) console.error(`Error killing process: ${killErr}`);
          else console.log(`Process killed successfully`);
        });
      } else {
        console.log(`No process found using port ${port}`);
      }
    });
  });
};

// Replace 5000 with the port you're using
checkPort(5000);
