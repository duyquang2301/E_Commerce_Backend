

const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic, furniture } = require("../models/product.model");
const { findAllDraftsForShop } = require("../models/repository/product.repository");

class ProductFactory {
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`Invalid Product Type:::${type}`);

    return new productClass(payload).createProduct()
  };

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftsForShop({ query, limit, skip });
  }
}

class Product {
  constructor({
    product_name, product_thumb, product_description,
    product_price, product_quantity, product_type,
    product_shop, product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newClothing) throw new BadRequestError("Error: Create new clothing error");
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError("Error: Create new product error");

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic) throw new BadRequestError("Error: Create new clothing error");

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError("Error: Create new electronic error");
    return newProduct;
  }
}

class Furnitures extends Product {
  async createProduct() {
    const newFurnitures = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurnitures) throw new BadRequestError("Error: Create new furnitures error");

    const newProduct = await super.createProduct(newFurnitures._id)
    if (!newProduct) throw new BadRequestError("Error: Create new product error");
    return newProduct;
  }
}



ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furnitures);

module.exports = ProductFactory;
