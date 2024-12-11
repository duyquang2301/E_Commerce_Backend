const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repository/inventory.repository");
const {
  findAllDraftsForShop,
  findAllPublishForShop,
  publicProductByShop,
  unPublicProductByShop,
  searchProductByUser,
  findProducts,
  findProduct,
  updateProductById,
} = require("../models/repository/product.repository");
const { removeUndefinedObject, updateNestedObjectParse } = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

class ProductFactory {
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type:::${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type:::${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };

    return await findAllPublishForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publicProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublicProductByShop({ product_shop, product_id });
  }

  static async findProductBySearch({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb", "product_shop"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product_stock in inventory
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      })

      pushNotiToSystem({
        type: 'SHOP-001',
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop
        }
      }).then(rs => console.log("---------------", rs))
        .catch(error => console.log("----------------------error", error))
    }

    return newProduct;
  }

  async updateProduct(product_id, bodyUpdate) {
    return await updateProductById({ product_id, bodyUpdate, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new BadRequestError("Error: Create new clothing error");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new BadRequestError("Error: Create new product error");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        objectParams: updateNestedObjectParse(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Error: Create new clothing error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct)
      throw new BadRequestError("Error: Create new electronic error");
    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        objectParams: updateNestedObjectParse(objectParams.product_attributes),
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

class Furnitures extends Product {
  async createProduct() {
    const newFurnitures = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurnitures)
      throw new BadRequestError("Error: Create new furnitures error");

    const newProduct = await super.createProduct(newFurnitures._id);
    if (!newProduct)
      throw new BadRequestError("Error: Create new product error");
    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        objectParams: updateNestedObjectParse(objectParams.product_attributes),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams));
    return updateProduct;
  }
}

ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furnitures);

module.exports = ProductFactory;
