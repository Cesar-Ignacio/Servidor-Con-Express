import fs from 'fs';



class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this._title = title;
        this._description = description;
        this._price = price;
        this._thumbnail = thumbnail;
        this._code = code;
        this._stock = stock;
        (Product.autoId++) || (Product.autoId = 1);
        this._id = Product.autoId;
    }

    toString() {
        console.log(`ID: ${this._id} Title ${this._title}, Description ${this._description} `)
    }
}

export class ProductManager {
    constructor(path) {
        this._path = path;
        this._products = [];
    }

    async crearArhivo() {
        await fs.promises.writeFile(this._path, "");
    }

    async inicializarValores() {
        try {
            const data = await this.readFile();
            this._products = await JSON.parse(data);
        } catch (error) {
            await this.crearArhivo();
        }
    }

    async readFile() {
        return await fs.promises.readFile(this._path, "utf-8")
    }

    async writeFile() {
        await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, '\t'));
    }

    async addProduct(...campos) {
        await this.inicializarValores();
        const code = campos[4];
        const existeCode = this._products.some(product => product._code === code);

        (campos.length > 5) ? (
            (existeCode) ? (console.log(`El code "${code}" ya existe`))
                : (this._products.push(new Product(...campos)),
                    await this.writeFile(), console.log("Se agrego el producto"))
        ) :
            (console.log("Se espera 6 parametros"))

    }

    async getProducts() {
        try {
            const data = await this.readFile();
            return JSON.parse(data)
        }
        catch (error) {
            return [];
        }
    }

    async getProductById(idProducto) {
        try {
            const data = JSON.parse(await this.readFile())

            const product = data.find(product => product._id === idProducto);

            return product || new Error("Error id no encontrado");

        } catch (error) {

            console.log("No se pudo leer el archivo");
        }

    }

    async updateProduct(idProducto, campos) {

        await this.inicializarValores()

        if (this.existeProducto(idProducto)) {
            this._products = this._products.map(producto => {
                (producto._id === idProducto) && (
                    producto = { ...producto, ...campos }
                )
                return producto;
            })
            await this.writeFile();
            console.log("Se actualizo el producto con ID ", idProducto)
        }

    }

    async deleteProduct(idProducto) {
        await this.inicializarValores();

        try {
            if (!this.existeProducto(idProducto)) {
                throw new Error("No existe el ID " + idProducto)
            }

            this._products = this._products.filter(product => product._id != idProducto);
            await this.writeFile();

        } catch (error) {
            console.log(error)
        }

    }

    existeProducto(idProducto) {
        return this._products.some(product => product._id === idProducto)
    }
}
/**Prueba */
// const pm = new ProductManager("./Productos.json");
// const data=await pm.getProducts();
// console.log(data);
// await pm.addProduct("producto prueba", "producto prueba", 200, "sin imagen", "abc123", 25);
// console.log(await pm.getProducts());
// console.log(await pm.getProductById(1));
// await pm.updateProduct(1,{"_title":"Nuevo Producto"});
// await pm.deleteProduct(1);