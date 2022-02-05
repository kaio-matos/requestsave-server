import { app } from "./app";
// import fs from 'fs'
// import https from 'https'

// // Carrega o certificado e a key necessários para a configuração.
// const options = {
//   key: fs.readFileSync('certificate.key'),
//   cert: fs.readFileSync('certificate.cert')

// }

// // Cria a instância do server e escuta na porta 3333
// https.createServer(options, app).listen(process.env.PORT, () => {
//   process.env.PORT
//     ? console.log('Dev server opened in port ' + `https://192.168.15.8:${process.env.PORT}`)
//     : console.log('Server opened with success')
// })

app.listen(process.env.PORT, () => {
  process.env.PORT
    ? console.log(
        "Dev server opened in port " + process.env.PORT
      )
    : console.log("Server opened with success");
});
