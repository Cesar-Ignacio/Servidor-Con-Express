import { ProductManager } from "./ProductManager.js";
import express from 'express'

const pm = new ProductManager("./Productos.json");
const app = express();
const port = 8080;

app.get("/", (req, res) => {
    res.send("<h1>Bienvenido</h1>")
})

app.get('/products', async (req, res) => {
    const limite = req.query.limit;
    let data = await pm.getProducts();
    (limite) && (data = data.filter((product, i) => i + 1 <= limite));
    res.send(data)
})

app.get('/products/:pid', async (req, res) => {
    const id = req.params.pid;
    const data = await pm.getProductById(parseInt(id));
    (data?._id)?(res.send(data)):(res.send({erro:"No se encontro producto",id}));

})

app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}/`)
})

