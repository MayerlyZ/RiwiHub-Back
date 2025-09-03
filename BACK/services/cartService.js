import CartItem from '../models/cartItem.js';
import Item from '../models/item.js';
import ShoppingCart from '../models/shoppingCart.js'; 
import { Op } from 'sequelize';

export const addItemToCart = async (user_id, item_id, quantity) => {

  // Find the user's cart
  let cart = await ShoppingCart.findOne({ where: { user_id } });

  // If the cart doesn't exist, create one
  if (!cart) {
    cart = await ShoppingCart.create({ user_id });
  }

  // Get the item's price
  const item = await Item.findByPk(item_id);
  if (!item) throw new Error('Item not found');
  const unit_price = Number(item.price);

  // Search for the cart item
  let cartItem = await CartItem.findOne({ where: { cart_id: cart.cart_id, item_id } });

  if (cartItem) {
    // If the item is already in the cart, update the quantity and unit_price
    cartItem.quantity += quantity;
    cartItem.unit_price = unit_price;
    await cartItem.save();
  } else {
    // If the item is not in the cart, add it
    cartItem = await CartItem.create({ cart_id: cart.cart_id, item_id, quantity, unit_price });
  }
  return cartItem;
};

// Remove an item from the cart
export const removeItemFromCart = async (user_id, item_id) => {
  const cart = await ShoppingCart.findOne({ where: { user_id } });
  if (!cart) return null;
  const deleted = await CartItem.destroy({ where: { cart_id: cart.cart_id, item_id } });
 return deleted;
};

// Get the contents of the cart
export const getCartContents = async (user_id) => {
  const cart = await ShoppingCart.findOne({ where: { user_id } });
  if (!cart) return [];
  return await CartItem.findAll({ where: { cart_id: cart.cart_id } });
};

// Get the cart by user ID

export const getCartByUserId = async (user_id) => {
  const cart = await ShoppingCart.findOne({
    where: { user_id },
    include: [{ model: CartItem, as: 'cartItems', include: [{ model: Item, as: 'item' }] }]
  });
  if (!cart) return null;

  // Map cartItems to include product details
  const items = cart.cartItems.map(cartItem => {
    const product = cartItem.item;
    return {
      cart_item_id: cartItem.cart_item_id,
      item_id: cartItem.item_id,
      quantity: cartItem.quantity,
      unit_price: Number(cartItem.unit_price),
      subtotal: Number(cartItem.subtotal),

      // Detalles del producto
      item: { 
        name: cartItem.item?.name,
        description: cartItem.item?.description,
        image_url: cartItem.item?.image || null,
        price: Number(cartItem.item?.price),
        type: cartItem.item?.type,
        category_id: cartItem.item?.category_id,
        seller_id: cartItem.item?.seller_id
      }
    };
  });

  // Calcular el total del carrito
  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

  return {
    cart_id: cart.cart_id,
    user_id: cart.user_id,
    items,
    total
  };
};
