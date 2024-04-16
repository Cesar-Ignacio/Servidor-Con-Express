import { ProductManager } from "./ProductManager.js";
import express from 'express'

const pm = new ProductManager("./Productos.json");
const app = express();
const port = 8080;

app.get("/",(req,res)=>{
    res.send("<h1>Bienvenido</h1>")
})

app.get('/products', async (req, res) => {

    const limite = req.query.limit;
    let data = await pm.getProducts();
    (limite) && (data = data.filter((product, i) => i + 1 <= limite));
    res.send(data)
})

app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}/`)
})

