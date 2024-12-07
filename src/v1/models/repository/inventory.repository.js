const { convertToObjectIdMongodb } = require("../../utils")
const { inventory } = require("../inventory.model")

const insertInventory = async ({
  productId, shopId, stock, location = 'unKnow'
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_shopId: shopId,
    inven_location: location,
  })
}

const reservationInventory = async ({ produtcId, quantity, cartId }) => {
  const query = {
    inven_productId: convertToObjectIdMongodb(produtcId),
    inven_stock: { $gte: quantity },
  }, updateSet = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservations: { 
        quantity,
        cartId,
        createOn: new Date()
      }
    }
  }, option = { upsert: true, new: true };
  return await inventory.updateOne(query, updateSet, option);
}


module.exports = {
  insertInventory,
  reservationInventory
}